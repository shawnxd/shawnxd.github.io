---
title: "Designing a Distributed Search Engine (Elasticsearch, Algolia)"
date: "2022-06-14"
summary: "What's inside a search engine — inverted indexes, sharding by document vs by term, query understanding, relevance scoring, and the trade-offs that make this one of the more interesting distributed systems problems."
---

## The shape of the problem

You have hundreds of millions of documents. A user types a query — usually a few words, sometimes a question, sometimes a SKU. You return the top 10 most relevant results in under 200ms.

The interesting parts:
- The corpus doesn't fit on one machine, but the latency budget assumes a single round trip.
- "Relevance" is partly mechanical (term match) and partly judgmental (which result does the user want).
- Documents change. The index needs to reflect those changes within seconds, not hours.

## The data structure that makes it possible

The **inverted index** flips the natural document-to-terms mapping into a term-to-documents mapping:

```
forward:
  doc:1 → [the, quick, brown, fox]
  doc:2 → [the, lazy, dog]

inverted:
  the   → [doc:1, doc:2]
  quick → [doc:1]
  brown → [doc:1]
  fox   → [doc:1]
  lazy  → [doc:2]
  dog   → [doc:2]
```

A search for `quick fox` becomes an intersection of postings lists: `[doc:1] ∩ [doc:1] = [doc:1]`. Postings lists are sorted by doc ID, so intersection is a merge — linear in their combined size.

In production, postings lists hold more than just IDs: term frequency, positions, payloads. These power phrase queries (`"quick fox"`) and scoring.

## Sharding strategies

Inverted indexes live in shards. Two ways to slice:

### Document sharding

Hash each document to a shard. Each shard has a complete inverted index over its own documents.

Query path: send the query to every shard, get top K from each, merge top K-of-K at the coordinator.

Pros: writes are local (one shard). Easy to scale horizontally.
Cons: every query hits every shard. With 1000 shards, you fan out 1000-wide for every query.

### Term sharding

Hash each term to a shard. Each term's postings list lives entirely on one shard.

Query path: route the query to the shards that own its terms. For `quick fox`, that's 2 shards.

Pros: query touches fewer shards.
Cons: writes are expensive (one document touches every term's shard). Hot terms create hot shards.

In practice, **document sharding wins** at scale. Elasticsearch, Solr, and most production search systems shard by document. Fan-out cost is amortized across many concurrent queries; write throughput is what's hard to scale.

## Query path

```
client → coordinator → broadcast to N shards
                           ↓
                        each shard:
                          parse query
                          look up postings
                          intersect
                          score
                          return top K
                           ↓
                     merge K*N on coordinator
                           ↓
                     hydrate top K documents
                           ↓
                     return
```

The intersection-and-scoring step is the inner loop. Modern search engines spend a lot of compute optimizing it: WAND, block-max WAND, and similar pruning algorithms can skip large portions of postings lists when they can prove no remaining document could score high enough to make the top K.

## Scoring

The classic relevance formula is **TF-IDF**:

- TF (term frequency): how many times the term appears in this document
- IDF (inverse document frequency): how rare the term is across the corpus

```
score(term, doc) = TF(term, doc) * IDF(term)
```

Rare terms (`quasiparticle`) contribute more than common terms (`the`). The full score is summed over the query's terms.

Most production systems use **BM25**, which improves on TF-IDF by saturating TF (the 50th occurrence of a term doesn't matter as much as the 5th) and normalizing for document length.

On top of that, modern systems layer:
- **Field boosts** — matching in the title is worth more than matching in the body
- **Freshness** — newer documents get a boost
- **Personalization** — based on prior behavior
- **Learning-to-rank** — a trained model re-scores the top N from BM25

## Indexing pipeline

Real-time indexing is hard. The classic compromise: **append-only segments**.

- New documents go into a fresh in-memory segment.
- Periodically, the in-memory segment flushes to disk as a new immutable segment.
- Periodically, small segments are merged into bigger ones.
- Deletes are tombstones; merges compact them away.

A search query reads from all live segments and merges results. This is essentially the LSM-tree pattern, applied to inverted indexes.

For Elasticsearch, the trade-off knob is the **refresh interval** — how often in-memory writes become searchable. Default is 1 second. Push it higher to save CPU; push it lower for stricter freshness.

## Query understanding

The user typed `cheap flihts to bos`. What now?

- **Tokenization** — break the query into terms
- **Spell correction** — `flihts → flights`
- **Synonyms** — `cheap ≈ inexpensive`
- **Entity recognition** — `bos → BOS airport code → "Boston"`
- **Intent classification** — is this a search or a navigation?

This stage is where you get the most user-visible quality wins. The retrieval engine is "just" doing what it's told; query understanding is what tells it.

## Caching

Two layers help:
- **Result cache** — cache the top K for popular queries. Massive win for head queries; useless for the long tail.
- **Filter cache** — cache the doc-ID bitsets for common filters (`status:active`, `region:us`). Filters are run-length-encodable and amenable to bitwise ops.

## What's hard at scale

- **Hot shards** — one shard's documents become disproportionately popular. Mitigate with replication and intelligent shard placement.
- **Long-tail latency** — broadcast queries are gated on the slowest shard. **Hedged requests** (send to a replica after a timeout, take whichever returns first) flatten the tail.
- **Index updates during searches** — handled by the segment model above, but careful about reader lifecycle to avoid holding old segments forever.

## The mental model that helps

A search engine is a **map-reduce that runs on every keystroke**, with relevance ranking baked in. Once you see it that way, the rest of the design — sharding, replication, refresh intervals — slots into the same shapes you'd reach for in any distributed system.
