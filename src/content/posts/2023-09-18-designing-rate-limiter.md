---
title: "Designing a Rate Limiter (Cloudflare, Stripe API)"
date: "2023-09-18"
summary: "Algorithms, data structures, and architecture choices for a distributed rate limiter that handles millions of QPS across a fleet — token bucket vs sliding window, Redis vs in-memory, and how to keep the latency overhead in the sub-millisecond range."
---

## What rate limiting actually has to do

A rate limiter answers one question, very fast, for every incoming request:

> Has this client exceeded its allowed rate?

That sounds simple. The interesting parts:

- "This client" — by IP? by API key? by user + endpoint?
- "Allowed rate" — per second? per minute? burst plus sustained?
- "Very fast" — under a millisecond, because every request waits on the answer.
- And finally: this all has to work consistently across a fleet of stateless API servers.

## Algorithms

There are four standard ones. They differ in burst behavior and memory cost.

### Token bucket

A bucket holds N tokens, refilled at rate R. Each request consumes one. If the bucket is empty, the request is rejected.

```
allow_request(key):
  bucket = get_or_create(key)
  now = monotonic()
  bucket.tokens = min(N, bucket.tokens + (now - bucket.last_refill) * R)
  bucket.last_refill = now
  if bucket.tokens >= 1:
    bucket.tokens -= 1
    return ALLOW
  return DENY
```

Allows bursts up to N, sustained rate R. Two numbers per key (tokens, last_refill). Cheap. **This is the right default for most APIs.**

### Leaky bucket

Same shape as token bucket, but enforces output rate rather than input rate — requests queue up and drain at R per second. Good for traffic shaping, less common for HTTP rate limiting.

### Fixed window counter

Increment a counter per `(key, window)`. Reject if counter > N.

```
key:"user:123:minute:202310311534" → 7
```

Simple, exactly one int per key per window. The downside: clients can send 2N in a 2-second span — N at the end of one window, N at the start of the next.

### Sliding window log

Store a sorted set of timestamps per key. Reject if more than N in the last 60s. Exact but memory-heavy — every request is one entry until it expires.

### Sliding window counter

A compromise: store counts per fixed sub-window, and on each check, compute a weighted sum across the window boundary.

```
this_minute = key:202310311534
last_minute = key:202310311533
weight = (60 - seconds_into_this_minute) / 60
estimated = this_minute_count + last_minute_count * weight
```

Two ints per key, smooths out the fixed-window edge. **My default if I need a per-minute / per-hour limit with smooth behavior.**

## Where the state lives

A single-machine rate limiter is easy. A fleet of stateless API servers all making decisions about the same client is the actual problem.

Two common architectures:

### Centralized counter (Redis)

Every API server `INCR`s a counter in Redis. Lua script makes the check + decrement atomic.

```lua
-- token bucket in one round trip
local tokens = tonumber(redis.call('HGET', KEYS[1], 'tokens')) or N
local last = tonumber(redis.call('HGET', KEYS[1], 'last')) or 0
local now = tonumber(ARGV[1])
tokens = math.min(N, tokens + (now - last) * R)
if tokens < 1 then return 0 end
redis.call('HSET', KEYS[1], 'tokens', tokens - 1, 'last', now)
redis.call('PEXPIRE', KEYS[1], TTL_MS)
return 1
```

Pros: globally consistent. Cons: every request now eats one Redis round trip (1–2ms in the same DC, much worse cross-DC).

### Local approximation + reconciliation

Each API server keeps a local counter. Every K seconds (or K requests), it reconciles with Redis to fetch the global state.

Pros: zero-latency hot path. Cons: temporarily over- or under-limits during reconciliation lag. Acceptable for "be roughly fair" rate limits; not acceptable for billing.

### Sharded centralized

Shard Redis by key. A single key always lands on the same shard, so atomic ops work. Add read replicas if you ever need to scale check-only paths (rare — rate limit checks are always check-and-mutate).

## The hot key problem

Same as the URL shortener: one popular key (a customer behind a global launch) routes all to one shard. Options:

1. **Replicate across shards** — `key:0..N-1`, each server picks one at hash time. Aggregate at reconciliation.
2. **Hierarchical limits** — global limit at the edge (loose), per-customer limit at the service (strict).

## What the API server returns

When you reject a request, give the client what they need to back off:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 28
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1698778892
```

Be honest about `Retry-After` — clients with bad implementations will hammer otherwise.

## What I'd actually build

For most internal APIs: **token bucket** in **Redis** with a **Lua script** for atomicity. Limit checks add ~1ms p99 in the same DC. Add a circuit breaker so Redis failures fall open (allow all) rather than fail closed (reject all) — losing the rate limiter is much better than losing the API.
