---
title: "Designing a News Feed (Twitter Timeline, Facebook Feed)"
date: "2024-03-22"
summary: "Push vs pull vs hybrid fan-out, the celebrity problem, the ranking problem, and what a modern timeline pipeline actually looks like end-to-end."
---

## The deceptively simple ask

> Given a user, return a list of recent posts from people they follow, sorted by some relevance signal, in under 100ms.

Every part of that sentence hides a subsystem.

## Three approaches to fan-out

### Fan-out on write (push)

When user A posts, write that post into the timeline of every follower. Reading a timeline is a single sequential read.

```
when A posts:
  for follower in A.followers:
    timeline[follower].push(post)
```

Pros: reads are trivially fast.
Cons: writes explode. If Taylor Swift has 100M followers, a single post triggers 100M writes.

### Fan-out on read (pull)

Do nothing at write time. When a follower opens their feed, scatter-gather posts from everyone they follow, then merge-sort by time.

Pros: writes are cheap, even for celebrities.
Cons: reads are expensive. Following 500 people means 500 lookups on every page load.

### Hybrid

Most production systems do both:
- **Push** for users with normal follower counts (< some threshold like 10K). Their posts get fanned out.
- **Pull** for celebrities. Their posts live in their own store; followers scatter-gather them on read.
- On read, a follower's timeline = `(pre-fanned-out posts) ∪ (pulled posts from celebrities they follow)`.

This is the right answer at scale. The threshold is a knob you tune.

## What "the timeline" actually is

A sorted set of post IDs, scoped to a user. In Redis terms:

```
ZADD timeline:user:42 <score=timestamp> <post_id>
ZREVRANGE timeline:user:42 0 50      → most recent 50 post IDs
```

The IDs are then hydrated against a posts service in a batched `mget`.

Storage cost: 8 bytes × 1000 posts × 100M active users = ~800GB. Fits in a Redis cluster. For inactive users, you can lazily materialize on first read.

## The celebrity problem in detail

You can't fan out 100M writes synchronously on the publish hot path. Even with the hybrid approach, "users with 10K–100K followers" is a long tail that takes minutes to fan out.

Three knobs:
- **Asynchronous fan-out** — publish to a Kafka topic; workers do the timeline writes. The author sees their post in their own profile (single write); followers see it within seconds.
- **Active-follower fan-out** — only fan out to followers who've been active in the last N days. Inactive followers get the post via pull on next login.
- **Push-pull threshold** — keep pure pull for the top 1% of accounts by follower count. Don't fan out at all.

## Ranking

A reverse-chronological feed is a starting point. Modern feeds rank by some signal — engagement probability, freshness, source diversity, etc. The ranking stage is a separate service:

```
candidate ids → feature service → ranker (often a model) → top K → hydrate
```

Candidate generation often pulls 2–5× the displayed count to give the ranker something to choose from. The ranker is the second most expensive thing in the pipeline after fan-out (and often the bottleneck on read latency).

## End-to-end pipeline

```
[publish]
    ↓
post-service writes to posts table
    ↓
emit event to Kafka
    ↓
fan-out workers populate timeline:user:* in Redis
                    ↓
              celeb posts skip fan-out, live in author:posts:*

[read]
client opens app
    ↓
get timeline:user:42 from Redis (push'd posts)
    ↓
merge with pulled posts from each followed celebrity
    ↓
candidate ids → ranker → top 50
    ↓
hydrate via posts service (batch mget)
    ↓
render
```

## What I'd skip on a first pass

- Personalized ranking — start with reverse-chrono and a small set of demotion rules (e.g. demote already-seen posts).
- Mute/block lists — apply as a post-hydration filter, then ask whether it's worth pushing into candidate generation.
- Cross-region replication — only matters at very large scale, and only after the single-region design is stable.

## What's hard that this glosses over

- **Hydration consistency** — what if a post is deleted between fan-out and read? Filter at hydration. (Don't try to chase deletions across millions of timeline copies.)
- **Edit propagation** — usually you don't propagate edits; the timeline stores IDs, and the post service serves the latest version.
- **Spam and ranking abuse** — entire eng orgs exist to solve this; it's a different problem from "make the feed fast".

The mental model that helps: think of the timeline as **a cached, sorted view of post IDs**, with everything else being plumbing or policy on top of it.
