---
title: "Design a Distributed Job Scheduler (Like Airflow)"
date: "2025-02-07"
summary: "How to design a system that schedules and executes jobs at scale—supporting immediate, future, and recurring runs while handling 10k+ jobs per second. A system design guide with core entities, API, and deep dives."
---

## What is a Job Scheduler?

A **job scheduler** is a system that automatically schedules and executes jobs at specified times or intervals. It automates repetitive work, scheduled maintenance, and batch processes. Products like [Apache Airflow](https://airflow.apache.org/), AWS Step Functions, and Cron at scale all solve this space.

This breakdown follows the structure and problem framing from [Hello Interview’s Job Scheduler breakdown](https://www.hellointerview.com/learn/system-design/problem-breakdowns/job-scheduler)—we expand on it with concrete design choices and tradeoffs.

![Job Scheduler – System Design Overview](/images/job-scheduler/job-scheduler-hero.png)

## Key Concepts: Tasks vs Jobs

Two terms are worth defining up front:

* **Task** – The abstract unit of work. For example, “send an email.” Tasks are reusable and can be run many times by different jobs.
* **Job** – A **scheduled instance** of a task. It includes the task to run, when it should run (schedule), and parameters. Example: “Send an email to john@example.com at 10:00 AM Friday.”

The scheduler’s job is to take a set of jobs and **execute them according to their schedule**.

## Functional Requirements

**In scope:**

1. **Schedule jobs** in three ways:
   * **Immediate** – Run as soon as possible.
   * **At a future time** – Run once at a given date/time.
   * **Recurring** – Run on a schedule (e.g. “every day at 10:00 AM”).
2. **Monitor job status** – Users can see whether a job is pending, running, succeeded, or failed.

**Out of scope (for this problem):**

* Cancel or reschedule jobs (can be added as a follow-up).

## Non-Functional Requirements

Clarify scale in an interview. A typical target: **~10k job executions per second**, with execution starting **within about 2 seconds** of the scheduled time.

## Core Entities

* **Task** – `task_id`, name, type (e.g. HTTP callback, script, Lambda), config (timeout, retries, payload schema).
* **Job** – `job_id`, `task_id`, schedule (one-time timestamp or cron/recurrence), parameters, `user_id`, status, `created_at`, `next_run_at`.
* **JobRun (Execution)** – `run_id`, `job_id`, status (pending / running / succeeded / failed), `scheduled_at`, `started_at`, `finished_at`, result or error payload.
* **Schedule** – Encodes “when”: either a single `run_at` or a recurrence (cron expression or interval).

## API Design

* `POST /jobs` – Create job (task_id, schedule, parameters). Returns `job_id`.
* `GET /jobs/:job_id` – Get job metadata and current status.
* `GET /jobs/:job_id/runs` – List runs (with pagination, filters by status/time).
* `GET /runs/:run_id` – Get a specific run (status, timestamps, result/error).

Optional later: `PATCH /jobs/:job_id` (reschedule/cancel), `POST /jobs/:job_id/trigger` (ad-hoc run).

## Data Flow (High Level)

1. **Submit** – Client calls `POST /jobs`. API validates task and schedule, writes Job (and optionally first JobRun) to durable storage.
2. **Schedule** – A scheduler process (or distributed cron) periodically finds jobs whose `next_run_at <= now`, creates JobRuns, and enqueues work.
3. **Execute** – Workers pull from a queue (or are assigned runs), execute the task (e.g. HTTP call, run script), update run status and result.
4. **Recurrence** – After a run completes, if the job is recurring, compute next `next_run_at` and persist; scheduler will pick it up again.
5. **Monitor** – Clients use `GET /jobs/:job_id` and `GET /jobs/:job_id/runs` to see status and history.

## High-Level Architecture

* **API layer** – Stateless services that create/read jobs and runs; validate and persist to DB.
* **Scheduler service** – Wakes on an interval (e.g. every 1–2 seconds), queries “jobs due now” (e.g. `next_run_at <= now` and status = active), creates JobRuns and publishes to an **execution queue** (e.g. Kafka, SQS, Redis Streams).
* **Worker pool** – Consumers that dequeue run messages, execute the underlying task (call handler, run container, etc.), then update run status and, for recurring jobs, update `next_run_at`.
* **Storage** – **Jobs and runs**: relational DB (e.g. PostgreSQL) or a scalable OLTP store; index on `(next_run_at, status)` for the scheduler query. **Queue**: Kafka, SQS, or Redis for at-least-once delivery and scaling.

This gives you a clear separation: **API** (submit + read), **Scheduler** (when to run), **Workers** (run the work).

## Deep Dive 1: Executing Within ~2 Seconds of Scheduled Time

* **Scheduler tick** – Run the “find due jobs” loop every 1–2 seconds so nothing sits due for long.
* **Efficient due-job query** – Index `(status, next_run_at)` so the scheduler only scans jobs that are active and due; limit batch size to avoid long transactions.
* **Clock sync** – Use NTP and avoid relying on a single machine’s clock for “now”; use a shared time source or leader-elected scheduler so “due” is consistent.
* **Avoid head-of-line blocking** – Don’t do heavy work in the scheduler; it should only enqueue. Execution happens in workers.

## Deep Dive 2: Scaling to ~10k Jobs per Second

* **Partition the queue** – Shard by `job_id` or tenant so many workers can consume in parallel; use Kafka partitions or multiple SQS queues.
* **Scale workers horizontally** – Add more worker instances; queue depth and consumer lag drive autoscaling.
* **Scheduler scalability** – Either single scheduler with a very fast “due jobs” query and batching, or **distributed scheduler** (e.g. shard by `job_id` range or use a consistent-hash ring) so each node owns a subset of jobs and only that subset is scanned each tick.
* **DB and queue** – Ensure the job/run DB can handle 10k+ writes/sec (runs created + status updates); use batching, connection pooling, and consider splitting “hot” run updates to a faster store or async updates. Queue must support 10k+ msg/sec throughput.

## Deep Dive 3: At-Least-Once Execution

* **Durable queue** – Use Kafka, SQS, or Redis Streams with persistence so “run this job” is not lost on crash.
* **Idempotent execution** – Design task handlers so running the same `run_id` twice (e.g. retry after timeout) doesn’t double-apply side effects; use `run_id` in idempotency keys where applicable.
* **Status transitions** – Update run status (e.g. running → succeeded/failed) in a single write; use conditional updates or DB constraints so a run can’t be marked completed twice with different outcomes.
* **Scheduler durability** – After creating JobRuns and enqueueing, persist “last processed” or run state so if the scheduler crashes, the next tick doesn’t skip or double-create runs. Idempotent run creation (e.g. unique `run_id` per job + scheduled time) helps.

---

Putting it together: a **distributed job scheduler** needs a clear separation between **scheduling** (when to run), **execution** (running the task), and **storage** (jobs, runs, queue). With the right indexes, a fast scheduler tick, a scalable queue and worker pool, and careful handling of durability and idempotency, you can support high throughput and timely, at-least-once execution.

For more problem breakdowns in this style, see [Hello Interview – Job Scheduler](https://www.hellointerview.com/learn/system-design/problem-breakdowns/job-scheduler).
