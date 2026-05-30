---
title: "Designing a Distributed Cache (Redis Cluster, Memcached)"
date: "2022-11-08"
summary: "How to design a key-value cache that scales horizontally without sacrificing latency — consistent hashing, replication, eviction policies, and the cache-stampede problem."
---

## The role of a cache

A cache is, fundamentally, a fast read-mostly store sitting in front of something slower. Postgres queries take 5–20ms; a Redis `GET` takes 0.2ms. For repeated lookups, that gap pays for itself a thousand times over.

But you can't put one Redis box in front of a billion-row workload. The interesting design surface is what happens when one box isn't enough.

## What you're designing for

- **Reads**: hundreds of thousands to millions per second
- **Latency**: p99 < 1ms
- **Hit rate**: 80%+ — below that, you're better off without the cache
- **Memory budget**: finite. Have to evict.
- **Failure**: a cache node dying should not take down the application

## Data partitioning

You need to spread keys across N nodes. The naïve approach — `hash(key) % N` — fails the moment you add or remove a node. Every key remaps and everything misses.

**Consistent hashing** solves this:

1. Hash each node to a position on a 0..2^32 ring.
2. Hash each key to a position on the same ring.
3. The key goes to the next node clockwise.

When you add a node, only the keys "between" the new node and the previous one remap — about `1/N` of all keys, not all of them.

In practice you give each node many **virtual nodes** (~150 positions on the ring) for better load distribution. This is what Memcached clients, Cassandra, and DynamoDB all use under the hood.

## Replication

A single node holding a partition is a single point of failure. Replicate each partition to one or two followers:

- **Primary-replica** — writes go to primary, reads can hit either. Standard.
- **Quorum** — N replicas, read from R, write to W, with `R + W > N` for read-your-writes consistency. Dynamo-style.

For a cache, eventual consistency is usually fine — a stale cache entry is rarely catastrophic.

## Eviction

Memory is finite. When you hit the cap, what do you evict?

| Policy | Description | When to use |
|---|---|---|
| **LRU** | Evict least recently used | Default. Tracks recency. |
| **LFU** | Evict least frequently used | Stable hot keys, periodic cold scans |
| **FIFO** | Evict in insertion order | Cheap, often poor |
| **TTL** | Per-key expiry | Time-sensitive data, e.g. tokens |
| **Random** | Evict random entry | Cheap and surprisingly competitive |

LRU is the standard. Redis defaults to "approximate LRU" — it samples K random keys and evicts the oldest among them — because exact LRU requires a doubly-linked list update per access (cache-unfriendly).

## The hot-key problem

One key — `session:userid:1234` for a celebrity, or `config:global` — receives a disproportionate share of traffic. The shard holding it gets hammered.

Mitigations:
- **Replicate the hot key** to all shards; client reads from a random one
- **Client-side cache** with short TTL — most requests don't even reach the cache server
- **Probabilistic early expiration** — clients refresh slightly before TTL to spread renewal load

## The cache stampede

A popular key expires. A thousand concurrent requests all miss simultaneously. A thousand DB queries follow.

Fixes:
- **Single-flight** at the application — only one process recomputes, others wait on its result.
- **Probabilistic early expiration** — Anonymous citation: with probability `delta * beta * log(rand())`, treat the value as expired even though it isn't. Spreads renewal across the window.
- **Background refresh** — a separate job warms the cache on a schedule for known-hot keys.

## What the API looks like

Surprisingly thin. Most caches commit to a small interface and stay there:

```
GET key                  → value | nil
SET key value [TTL]      → OK
DEL key                  → 0 | 1
INCR / DECR              → number
HGET / HSET / HDEL       → hash ops
ZADD / ZRANGE            → sorted set ops
```

Resist the urge to add domain logic. The cache layer should know nothing about your business.

## What's left

Things this skips: persistence (RDB/AOF in Redis terms), pub/sub, Lua scripts, geographic replication, write-through vs cache-aside patterns. Those are choices that depend on what's on the other side of the cache.

The core decisions — **consistent hashing for partitioning, replication for HA, LRU for eviction, single-flight for stampedes** — are nearly universal. Get those right and the rest is plumbing.
