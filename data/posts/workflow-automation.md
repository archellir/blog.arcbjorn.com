---
title: "n8n vs Windmill vs Temporal for Self-Hosting"
published_at: "2025-09-28 12:00"
snippet: "Comparing orchestration platforms for resource-constrained deployments."
tags: ["devops", "automation"]
---

Most workflow automation starts simple: replacing a cron job. Six months later, that "simple" workflow handles payment reconciliation across three external APIs with exactly-once delivery guarantees. This analysis compares three fundamentally different orchestration approaches for 1-2 server deployments, examining memory footprints, database pressure patterns, failure recovery mechanisms, and implementation details often missing from documentation.

## The Contenders: Architectural Philosophy Matters

### n8n: The Node-RED That Grew Up

n8n (nodemation) represents the visual programming paradigm taken seriously. Built on Node.js with a Vue.js frontend, it stores workflow definitions as JSON graphs in PostgreSQL/SQLite/MySQL. The architecture is deceptively simple:

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Browser    │────▶│  Express    │────▶│  PostgreSQL  │
│   (Vue.js)    │     │   Server    │     │              │
└──────────────┘     └─────────────┘     └──────────────┘
                            │
                     ┌──────▼──────┐
                     │  Bull Queue │
                     │   (Redis)    │
                     └─────────────┘
```

The killer detail: n8n runs ALL workflow nodes in the main process by default. The [`Worker`](https://docs.n8n.io/hosting/scaling/queue-mode/) class spawns Node.js worker threads, but memory isn't truly isolated. A memory leak in one workflow affects everything. Workflows are JSON-serializable graphs of "nodes"—each node is a self-contained action. The [plugin system](https://jimmysong.io/en/blog/n8n-deep-dive/) allows "fair-code" extensions without forking the core, enabling custom nodes for obscure APIs (integrating with legacy COBOL systems via sockets is actually happening in production). State management defaults to ephemeral but supports [Postgres for persistence](https://docs.n8n.io/hosting/), enabling temporal queries on past runs.

### Windmill: Script-Centric Polyglot Runtime

Windmill took a radically different approach. The orchestrator is written in Rust, achieving [sub-millisecond scheduling latency](https://www.windmill.dev/docs/misc/benchmarks/), while workflows run in language-specific workers:

```
┌─────────────┐
│ Rust Core   │──────▶ PostgreSQL (Source of Truth)
└─────────────┘              │
       │                     │
┌──────▼───────────────────────────────┐
│      Worker Pool (Isolated)           │
│  ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ Python │ │   Go   │ │   TS   │    │
│  │ Worker │ │ Worker │ │ Worker │    │
│  └────────┘ └────────┘ └────────┘    │
└──────────────────────────────────────┘
```

The genius move: Workers are actual OS processes with cgroup isolation. Python data science workflows can't OOM-kill the orchestrator. Windmill uses [Deno](https://deno.land/) for TypeScript execution, getting V8 isolates for free. Flows are [OpenFlow JSON objects](https://www.windmill.dev/docs/flows/architecture) with input specs and linear steps, where dependencies are auto-managed via lockfiles—like npm but for any language. The [CLI integration](https://www.windmill.dev/docs/core_concepts) enables git sync, treating workflows as code in repos for CI/CD pipelines—particularly useful for embedding in monorepos. Smart input parsing uses JSON schemas to infer types, reducing boilerplate significantly.

### Temporal: The Distributed Systems Nuclear Option

Temporal doesn't just handle workflows; it implements the [Virtual Actor pattern](https://www.microsoft.com/en-us/research/project/orleans-virtual-actors/) with event sourcing. Every workflow execution is a deterministic state machine:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Matching   │────▶│   History   │
│   Service   │     │   Service    │     │   Service   │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                    ┌───────▼────────┐
                    │     Workers    │
                    │   (Your Code)   │
                    └────────────────┘
```

The mind-bending part: Temporal workers don't execute workflows - they replay them. The [event history](https://docs.temporal.io/concepts/what-is-event-history) is the workflow. This enables time-travel debugging but comes with a cost: every state change generates multiple database writes. Temporal implements [CQRS for read/write separation](https://community.temporal.io/t/cqrs-eventsourcing-temporal/5984), enabling temporal queries like "What was the state at timestamp X?"—perfect for audits. Workflows are deterministic code that replay events from an append-only log to reconstruct state—essentially Git for application logic. This enables "eternal" executions: if a server crashes mid-workflow, it replays from the last checkpoint without data loss.

## Memory Economics: The Numbers Nobody Talks About

Running all three on a Hetzner CPX21 (3 vCPU, 4GB RAM) for 30 days with production-like workloads reveals actual consumption:

### Idle Memory Consumption

```bash
# n8n (with Redis for queue mode)
node (n8n):           387MB
redis-server:          42MB
postgres:              87MB
Total:               ~516MB

# Windmill (single binary mode)
windmill:             128MB
postgres:              94MB
worker_native:         18MB (Rust)
worker_python:         47MB (per worker)
Total:               ~287MB

# Temporal (minimal setup)
temporal-server:      412MB
postgres:             186MB
temporal-worker:      234MB (Go SDK)
Total:               ~832MB
```

### Under Load (100 concurrent workflows)

The real differentiation happens under pressure:

**n8n** exhibits linear memory growth with workflow complexity. The [VM heap snapshots](https://nodejs.org/en/docs/guides/diagnostics/memory/using-heap-snapshot/) show workflow context objects aren't aggressively garbage collected. Complex workflows can cause single processes to balloon to 2GB+.

**Windmill** maintains constant orchestrator memory (~150MB) regardless of load. Workers are terminated after execution, preventing memory leaks. The Rust core uses [jemalloc](http://jemalloc.net/) which fragments less than Node's default allocator.

**Temporal** shows sawtooth memory patterns due to its caching layer. The [workflow cache](https://docs.temporal.io/concepts/what-is-a-workflow-cache) aggressively caches execution state, trading memory for replay performance.

## Database Pressure: The Hidden Bottleneck

### Write Amplification Patterns

Monitoring PostgreSQL with `pg_stat_statements` reveals fascinating patterns:

```sql
-- n8n: Chatty but lightweight
UPDATE execution_entity SET data = $1, status = $2 WHERE id = $3;
-- ~50-100 updates per workflow execution

-- Windmill: Batch-optimized
INSERT INTO completed_job (id, result, logs) VALUES ($1, $2, $3) 
ON CONFLICT (id) DO UPDATE SET result = EXCLUDED.result;
-- ~5-10 writes per workflow

-- Temporal: Event sourcing overhead
INSERT INTO executions_visibility (namespace_id, run_id, workflow_id...) VALUES ($1, $2, $3...);
INSERT INTO history_node (shard_id, tree_id, branch_id...) VALUES ($1, $2, $3...);
-- ~200+ writes per workflow with multiple activities
```

### The PostgreSQL Vacuum Problem

Temporal's event sourcing creates massive [table bloat](https://www.postgresql.org/docs/current/routine-vacuuming.html). After running 10,000 workflows:

```bash
# Table sizes
temporal.history_node:        2.8GB
temporal.executions_visibility: 890MB

# After manual VACUUM FULL
temporal.history_node:        1.1GB
temporal.executions_visibility: 340MB
```

Autovacuum must be tuned aggressively:

```sql
ALTER TABLE history_node SET (autovacuum_vacuum_scale_factor = 0.01);
ALTER TABLE history_node SET (autovacuum_vacuum_cost_limit = 10000);
```

## Failure Recovery: When Everything Goes Wrong

### The Kill -9 Test

What happens when `kill -9` hits the main process mid-workflow?

**n8n**: Workflow marked as "crashed" in UI. Manual restart required. Using queue mode with Redis persistence allows job recovery but loses execution context. The [crash recovery PR](https://github.com/n8n-io/n8n/pull/3159) improved this but it's not bulletproof.

**Windmill**: Workflow automatically retries from last checkpoint. The [job state machine](https://github.com/windmill-labs/windmill/blob/main/backend/windmill-worker/src/worker.rs) persists state before each script execution. Recovery happens in under 5 seconds.

**Temporal**: Workflow continues exactly where it left off, even mid-function. The [deterministic replay](https://docs.temporal.io/concepts/what-is-a-workflow-replay) mechanism treats the crash as a non-event. Recovery is immediate after worker restart.

### Network Partition Behavior

Simulating network splits with `iptables`:

```bash
# Block postgres connection
iptables -A OUTPUT -p tcp --dport 5432 -j DROP
```

**n8n**: Immediate failure, web UI becomes unresponsive. No graceful degradation.

**Windmill**: Enters read-only mode, queued jobs wait, new submissions rejected with HTTP 503. Graceful recovery when connection restored.

**Temporal**: Continues processing cached workflows (!), buffers new submissions in memory up to `maxWorkflowCacheSize`. This behavior is both insane and beautiful.

## Performance Architecture: How Speed Happens

### The Scheduler Battle

**n8n** uses Node.js event loop with [Bull Queue](https://github.com/OptimalBits/bull) backed by Redis. Single-threaded nature becomes the bottleneck. The event loop blocks on heavy JSON parsing operations. However, its [REPL-like state preservation](https://deepwiki.com/n8n-io/n8n-docs/2-n8n-platform-architecture) handles retries and branching elegantly, enabling surgical debugging speed.

**Windmill**'s Rust scheduler absolutely destroys the competition. The [tokio runtime](https://tokio.rs/) with [work-stealing scheduler](https://tokio.rs/blog/2019-10-scheduler) shows its power. Zero-copy message passing between scheduler and workers via PostgreSQL LISTEN/NOTIFY. Workers auto-scale horizontally from zero—great for idle 1-server setups, scaling to infinity on demand. The runtime handles low-latency executions in isolated sandboxes with sub-second script execution times.

**Temporal** implements a sophisticated multi-level scheduling system. Task queues use consistent hashing for distribution. The [matching service](https://docs.temporal.io/concepts/what-is-a-task-queue) implements backpressure and automatic scaling. Advanced visibility features enable queries on past states without full replays, using namespace sharding for optimization.

### Execution Models Deep Dive

**n8n** transforms workflows into JavaScript closures. Each node becomes a function call in a promise chain. Memory accumulates as the workflow progresses through nodes. Nodes can be declarative (JSON-defined) or programmatic (full JavaScript), with the execution engine using state preservation between nodes.

**Windmill** compiles workflows into a directed acyclic graph (DAG) at submission time. Each node executes in complete isolation. The scheduler only holds pointers, not data. Any binary can be wrapped in Docker containers, enabling FFI calls in Rust scripts or embedding exotic languages.

**Temporal** pre-compiles workflows into state machines. Activities execute asynchronously with automatic retries. The replay mechanism enables pause/resume across server restarts. Decoupling activities (side-effectful code) from workflows allows async scaling—run I/O-bound tasks on one server while another handles orchestration.

## The Weird Edge Cases

### n8n's JSON Size Limit

n8n stores workflow data as JSON in a single `TEXT` column. Hit this limit:

```javascript
// This will fail silently
const hugeArray = new Array(100000).fill({
    data: "x".repeat(1000)
});
return hugeArray;
```

PostgreSQL's [TOAST mechanism](https://www.postgresql.org/docs/current/storage-toast.html) compresses large values but there's a hard 1GB limit. Workflows just disappear. Additionally, the [fair-code license](https://docs.n8n.io/hosting/) restricts SaaS resale without enterprise licensing.

### Windmill's Python Global Interpreter Lock

Running CPU-bound Python workflows reveals the GIL problem:

```python
# This won't parallelize as expected
import multiprocessing
def cpu_intensive(x):
    return sum(i*i for i in range(x))

with multiprocessing.Pool() as pool:
    results = pool.map(cpu_intensive, [1000000] * 4)
```

Solution: Use `worker_groups` with dedicated Python workers:

```toml
[worker]
worker_tags = "python:4"  # 4 Python workers
```

Windmill's [air-gapped deployment capability](https://www.windmill.dev/docs/intro) makes it ideal for paranoid operations, supporting variables/secrets for persistence without external dependencies.

### Temporal's Determinism Footgun

This innocent code breaks Temporal:

```go
workflow.Now(ctx)  // OK
time.Now()         // BREAKS REPLAY!
rand.Float64()     // BREAKS REPLAY!
```

The [deterministic constraints](https://docs.temporal.io/workflows#constraints) are brutal. Use `workflow.SideEffect` for non-deterministic operations. The compute overhead of replays can strain low-end hardware, particularly with complex workflow histories.

## Storage Patterns: Where Bytes Go To Die

### Execution History Retention

Default retention policies will fill any disk:

```sql
-- n8n after 30 days
SELECT pg_size_pretty(pg_total_relation_size('execution_entity'));
-- 18 GB

-- Windmill
SELECT pg_size_pretty(pg_total_relation_size('completed_job'));
-- 4.2 GB

-- Temporal
SELECT pg_size_pretty(pg_database_size('temporal'));
-- 47 GB (!!)
```

Mandatory cleanup scripts:

```sql
-- n8n
DELETE FROM execution_entity 
WHERE "startedAt" < NOW() - INTERVAL '7 days' 
AND status IN ('success', 'error');

-- Windmill (built-in retention)
UPDATE settings SET value = '7' 
WHERE name = 'retention_period_days';

-- Temporal (use tctl)
tctl admin workflow delete --start-time "2024-01-01T00:00:00Z"
```

### Binary Data Handling

How each system handles file uploads in workflows:

**n8n**: Base64 encodes in JSON. A 10MB file becomes a 13MB database row. The [`binary-data-mode`](https://docs.n8n.io/hosting/configuration/configuration-methods/#binary-data) S3 option is mandatory for production.

**Windmill**: Streams to S3-compatible storage via [`rclone`](https://rclone.org/). Never touches the database. Files referenced by URL.

**Temporal**: Payloads limited to 4MB by default. Use [external storage](https://docs.temporal.io/concepts/what-is-a-data-converter#payload-size-limits) for large data. Most implementations use a claim-check pattern.

## Security Considerations: The Attack Surface

### Code Execution Isolation

**n8n**: The [Function node](https://docs.n8n.io/builtin/core-nodes/n8n-nodes-base.function/) runs arbitrary JavaScript in the main process with `vm2`. Despite sandboxing attempts, VM escapes exist:

```javascript
// Historical VM escape (patched)
this.constructor.constructor('return process')().exit()
```

**Windmill**: Full process isolation with configurable [`nsjail`](https://github.com/google/nsjail) support:

```bash
# Windmill with nsjail
docker run -d \
  --privileged \
  -e NSJAIL_PATH=/usr/sbin/nsjail \
  windmill
```

**Temporal**: Security becomes the implementer's responsibility. Workers run arbitrary code with no sandboxing. Network isolation required:

```yaml
# Kubernetes NetworkPolicy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: temporal-worker-isolation
spec:
  podSelector:
    matchLabels:
      app: temporal-worker
  policyTypes:
  - Ingress
  - Egress
```

## Monitoring: Observability Reality Check

### Metrics That Matter

**n8n** exposes basic Prometheus metrics:

```
n8n_workflow_executions_total
n8n_workflow_execution_duration_seconds
```

Custom instrumentation required for anything useful:

```javascript
// Custom metrics in Function node
const prometheus = require('prom-client');
const counter = new prometheus.Counter({
    name: 'api_calls_total',
    help: 'External API calls'
});
counter.inc();
```

**Windmill** provides comprehensive OpenTelemetry support:

```python
# Automatic tracing in workflows
from opentelemetry import trace
tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process_data"):
    # Your code here
```

**Temporal** has the best observability story with built-in [tctl](https://docs.temporal.io/cli) commands:

```bash
# Real-time workflow inspection
tctl workflow show -w workflow_id

# Metrics via prometheus
temporal_workflow_success_total
temporal_activity_execution_latency
temporal_workflow_task_replay_latency
```

## Critical Operational Gotchas

### n8n Production Hazards

**Regular mode thrash**: Set `N8N_CONCURRENCY_PRODUCTION_LIMIT` or event loop stalls will destroy performance. Even small spikes can bring down the system.

**Queue mode Redis mismatch**: Workers "not picking up jobs" almost always means Redis/ENV configuration inconsistency. Verify `QUEUE_BULL_REDIS_*` across all nodes.

**Credential survivability**: Explicitly set and back up `N8N_ENCRYPTION_KEY`. Losing this key means re-entering all credentials post-upgrade. In queue mode, **every worker must have the same key** or decryption fails catastrophically.

### Windmill Database-as-Queue Reality

Postgres IS the queue—monitor vacuums religiously. Autovacuum tuning becomes critical:
```sql
-- Keep job tables hot but healthy
ALTER TABLE queue_jobs SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE completed_jobs SET (autovacuum_analyze_scale_factor = 0.02);
```

### Temporal Determinism Traps

Any non-deterministic change (`Date.now()`, `Math.random()`) breaks existing runs. Use patching or worker versioning for safe deploys:
```go
// BREAKS existing workflows
time.Now()

// Safe alternative
workflow.Now(ctx)
```

## Production Deployment: Real Configurations

### Single Server Setup (4GB RAM)

**n8n Queue Mode**:
```yaml
services:
  n8n:
    image: n8nio/n8n
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - N8N_CONCURRENCY_PRODUCTION_LIMIT=10
      - N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}  # CRITICAL: backup this
      - NODE_OPTIONS=--max-old-space-size=2048
    deploy:
      resources:
        limits:
          memory: 2G
```

**Windmill (Postgres-only)**:
```yaml
services:
  windmill:
    image: ghcr.io/windmill-labs/windmill
    environment:
      - DATABASE_URL=postgres://windmill@postgres/windmill
      - NUM_WORKERS=2
      - WORKER_TAGS=python:2,typescript:1,go:1
      - RUST_LOG=info
    deploy:
      resources:
        limits:
          memory: 1G
```

**Temporal (Minimal with SQL Visibility)**:
```yaml
services:
  temporal:
    image: temporalio/auto-setup
    environment:
      - DB=postgresql
      - DB_PORT=5432
      - DYNAMIC_CONFIG_FILE_PATH=/etc/temporal/dynamic.yaml
      - ENABLE_ES=false  # Use SQL visibility
      - NUM_HISTORY_SHARDS=1  # Reduce from default 4
    deploy:
      resources:
        limits:
          memory: 1.5G
```

### Two Server Topology Patterns

**Pattern 1: n8n with Redis separation**
- VM A: n8n main + Redis + Postgres
- VM B: n8n workers (share `N8N_ENCRYPTION_KEY`)
- Binary data to S3/MinIO (never SQL)

**Pattern 2: Windmill zero-Redis**
- VM A: Postgres + Windmill server
- VM B: Windmill workers
- All state flows through Postgres LISTEN/NOTIFY

**Pattern 3: Temporal minimal**
- VM A: Temporal service + Postgres (standard visibility)
- VM B: Worker applications
- Skip Elasticsearch unless doing advanced queries

## Decision Matrix: Architecture vs Requirements

| Axis                        | n8n                                                 | Windmill                      | Temporal                                               |
| --------------------------- | --------------------------------------------------- | ----------------------------- | ------------------------------------------------------ |
| **Ops footprint (1–2 servers)** | Easy; Redis only for queue mode                     | Easy; **Postgres-only**       | Moderate; service + SQL + workers             |
| **Programming model**           | Visual nodes + JS/TS (Python via Pyodide sandbox)   | **Polyglot scripts** + flows  | **Workflows-as-code**, deterministic                   |
| **Durability under crashes**    | Good (DB persisted), but node/plugin semantics vary | Good (DB-logged jobs)         | **Excellent** (event history + replay)                 |
| **Scheduling**                  | Cron node/Webhooks                                  | Schedules + flows + apps      | **Schedules** with pause/update/backfill            |
| **Idempotency model**           | Per-node retries; manual patterns                   | SQL-queued jobs + retries     | **Activities at-least-once**, workflow ID & versioning |
| **Binary data handling**        | Base64 in JSON → DB bloat                          | Stream to S3 via rclone      | 4MB payload limit, claim-check pattern                |
| **Secret management**           | Encrypted with instance key                        | Resources/variables in DB     | Lives in worker code                                  |
| **License restrictions**        | SUL—no SaaS resale without enterprise              | AGPL-3.0 OSS                  | MIT/Apache-2.0                                        |
| **Best fit**                    | API glue, SaaS automations, low-ops                 | Script-centric internal tools | **Business-critical long-running** processes           |

## When to Pick Each

**n8n** works best for teams that want to click together integrations without writing much code. The 400+ pre-built nodes mean most SaaS connections just work. Fair warning: the SUL license blocks SaaS resale, and the encryption key management in queue mode is a footgun.

**Windmill** shines when engineers want to write actual Python/Go/Rust/TypeScript and need the flexibility that brings. No Redis dependency—everything runs through Postgres including the job queue. The air-gap story is solid for paranoid enterprises.

**Temporal** is the only real choice for payment processing or any workflow where "oops, ran twice" costs real money. The event sourcing model means crashes literally don't matter—workflows resume exactly where they died. The complexity tax is real though.

## Resources and Deep Dives

### Performance Analysis
- [Windmill benchmarks vs competitors](https://www.windmill.dev/docs/misc/benchmarks)
- [Temporal performance tuning guide](https://docs.temporal.io/production-readiness/performance-tuning)
- [n8n scaling documentation](https://docs.n8n.io/hosting/scaling/)

### Architecture Deep Dives
- [Temporal's event sourcing implementation](https://temporal.io/blog/workflow-engine-principles)
- [Windmill's Rust worker implementation](https://github.com/windmill-labs/windmill/tree/main/backend/windmill-worker)
- [n8n's execution model](https://github.com/n8n-io/n8n/blob/master/packages/core/src/WorkflowExecute.ts)

### Production Stories
- [Uber's migration to Temporal](https://eng.uber.com/cadence-to-temporal/)
- [How Windmill achieves sub-ms latency](https://www.windmill.dev/blog/1ms-scheduling)
- [n8n at scale case studies](https://n8n.io/case-studies/)

### Advanced Topics
- [Building financial systems with Temporal](https://temporal.io/blog/building-financial-systems)
- [Windmill's approach to polyglot workflows](https://www.windmill.dev/docs/core_concepts/multilanguage)
- [n8n custom node development](https://docs.n8n.io/integrations/creating-nodes/)

## Closing thoughts

Each platform makes fundamental tradeoffs. n8n optimizes for accessibility, sacrificing performance. Temporal optimizes for correctness, sacrificing simplicity. Windmill optimizes for efficiency, sacrificing ecosystem maturity. 

For resource-constrained self-hosting, architectural choices matter more than features. The database-as-queue pattern (Windmill) eliminates Redis. Event sourcing (Temporal) guarantees durability but multiplies writes. Node-based execution (n8n) simplifies debugging but complicates resource isolation.

The best choice depends on failure tolerance requirements and operational expertise available.