---
title: "Designing a URL Shortener (Bitly, TinyURL)"
date: "2023-04-12"
summary: "How would you design a URL shortener that handles billions of links and millions of redirects per second? A walkthrough of the API, identifier generation strategies, hot-key handling, and the read-heavy storage layer."
---

## The problem

You have a long URL — `https://en.wikipedia.org/wiki/Universally_unique_identifier#Versions` — and you want a short, durable handle for it: `bly.co/Xa3yQ`. The user clicks the short link and gets redirected to the long one. That's it.

The interesting design questions show up at scale: how do you generate short codes without collisions across a fleet of servers? How do you handle "hot keys" — links that get billions of redirects? How read-heavy is the workload, and what does that imply for the storage layer?

## Requirements

Functional:
- Create a short URL from a long URL. The user may optionally specify a custom alias.
- Redirect the short URL to the long URL.
- Track analytics per short URL (click count, top countries, etc.).

Non-functional:
- ~100M new URLs per day, ~10B clicks per day → roughly **100x more reads than writes**.
- Redirect latency p99 < 100ms.
- Short codes should be 7 characters or fewer (base62 → 62⁷ ≈ 3.5 trillion combinations).

## Core entities

- **ShortLink** — `{code, long_url, owner_id, created_at, expires_at}`
- **ClickEvent** — `{code, ts, ip, ua, referrer}` (append-only stream)

## The API

```
POST   /api/links            → { long_url, custom_alias? } → { code }
GET    /{code}               → 302 to long_url
GET    /api/links/{code}/stats → { clicks, top_countries, ... }
```

The redirect endpoint is the hot path. Every other endpoint is rare by comparison.

## Generating short codes

Three families of approach. Each trades off coordination for predictability.

### 1. Hash the long URL

`code = base62(md5(long_url))[:7]`. Stateless, no coordination. But:
- The same URL always generates the same code — sometimes desirable (idempotent), sometimes not.
- Collisions: 7-char base62 has ~3.5T values; for 100M/day you'll see collisions within months. You need a collision-detection loop, which means a read before write — back to coordination.

### 2. Random + collision check

Pick 7 random base62 characters, attempt to insert with a unique constraint. On collision, retry. Simple and uniform, but write amplification under contention.

### 3. Pre-allocated counter (token range)

A central service hands each worker a **range** of integers (say, 1M IDs at a time). Each worker base62-encodes integers in its range to produce codes. No collisions, no coordination on the hot path.

The downside: ranges are sequential, so codes are easy to enumerate. Mitigate by shuffling within the range, or by salting the integer before encoding.

I'd go with **option 3** for a real system — high write throughput, no contention on the hot path, and you can mix in option 1 for the optional `custom_alias` case (just store the alias as the code if it's available).

## Storage

The data model is read-heavy and key-value shaped. Two reasonable choices:

- **DynamoDB / Cassandra** — key on `code`, value the long URL + metadata. Single-digit ms reads, scales horizontally, exactly what we need.
- **Postgres with a B-tree on `code`** — works fine at moderate scale, gives you SQL for analytics. Tap out around 5–10K writes/sec without partitioning.

For 10B clicks/day (~115K/sec average, ~5x peak), you want the partitioned key-value store. The hot path is `GET code → long_url`, served from a single index lookup.

## Cache layer

Even at 100K reads/sec from the DB, you'll spend money on read units. Put a CDN edge cache in front. Short links rarely change, so cache for hours. Cache hit rate of 80%+ is realistic.

```
client → CDN edge (cache hit?)
            ↓ no
          API server → Redis (cache hit?)
                          ↓ no
                        KV store
```

## Handling hot keys

A campaign link can spike to **millions of QPS** on a single code. If that key lives on one DynamoDB partition, you'll throttle. Two patterns:

1. **Replicate hot keys** — duplicate the row across N partitions with `code → code_0, code_1, …`. Read picks a random suffix. Detect hotness from access patterns and replicate dynamically.
2. **Edge cache the redirect itself** — for truly viral codes, cache a 302 response at the edge. The origin sees one request per cache TTL per edge POP.

In practice, do both: edge cache for the long tail of high-traffic links, partition replication for the very small set of mega-viral codes.

## Analytics pipeline

Don't write to the OLTP store from the redirect path. Emit a `ClickEvent` to Kafka and let downstream consumers populate analytics in batch. The redirect path stays at "single KV lookup + 302".

## What's left

A few things this skips that matter in production:
- Abuse: rate limits per IP, malware URL detection, blocklists.
- Expiration: TTL on `code → long_url` to evict dead links.
- Custom domains for enterprise customers.

But the core — code generation, KV storage, edge caching, hot-key handling — is the meat of the design. The rest is product surface.
