---
title: Minimal Prod-ready K8s Stack for Multi-Tenant SaaS
published_at: 2025-09-17 12:00
snippet: K3s, Argo CD, KEDA, VictoriaMetrics, cert-manager, and CloudNativePG for boring, reliable operations
tags: [linux, k8s]
---

Deploying many SaaS applications with enterprise reliability does not require heavyweight platforms. The stack below is a **lightweight, proven** combination that delivers **autoscaling, GitOps, TLS/DNS automation, metrics/logs, and backups** with minimal operational overhead. It favors defaults that are boring, stable, and easy to reason about.

---

## Overview

**Core control plane (ultra-lightweight)**

* **K3s (HA, embedded etcd)** — compact Kubernetes with a small, steady footprint
* **Traefik** — ingress controller (ships with K3s)
* **cert-manager** — automatic TLS issuance (prefer DNS-01)
* **ExternalDNS** — manages DNS records from Ingress/HTTPRoutes

**Platform capabilities**

* **Argo CD** — GitOps continuous delivery (declarative, auditable rollouts)
* **KEDA + HPA** — autoscaling from CPU/memory and event/metrics triggers, including scale-to-zero
* **VictoriaMetrics stack** — time-series storage, Alertmanager, Grafana dashboards
* **Loki (+ promtail/Vector)** — efficient log aggregation
* **Velero** — cluster & volume backups to S3/compatible storage
* **CloudNativePG** — PostgreSQL operator: HA, failover, backups, PITR
* **Longhorn** *(optional)* — distributed block storage with snapshots/backups

**Access**

* **Tailscale** — private admin access to dashboards/SSH (keep pod-to-pod traffic on the CNI)

---

## Why This Architecture Works

### Boring by design

* **Three K3s servers** form an HA control plane with embedded etcd (no external database).
* Defaults are kept wherever viable (Traefik, metrics-server, kube DNS) to reduce moving parts.
* Each component is mainstream and commonly deployed in production.

### Git as source of truth

* **Argo CD** continuously converges the cluster to what Git declares, enabling reproducible rollouts, easy rollbacks, and drift correction without granting developers cluster access.

### Autoscaling that matches reality

* **HPA** covers CPU/memory bursts.
* **KEDA** scales on meaningful signals (queue depth, Prometheus queries, cron windows, HTTP rates) and supports scale-to-zero for cost-sensitive services.

### Data safety first

* **Velero** protects cluster objects and volumes.
* **CloudNativePG** provides HA Postgres with **continuous backups** and **point-in-time recovery** to S3/compatible storage.
* **Longhorn** adds distributed volumes and scheduled S3 backups when block-storage replication is required.

---

## Reference Architecture

**Control plane (3× K3s servers)**

* Argo CD (GitOps)
* KEDA + metrics-server (autoscaling)
* Traefik (ingress)
* cert-manager + ExternalDNS (TLS/DNS automation)
* VictoriaMetrics stack (vmagent/VictoriaMetrics/Grafana/Alertmanager)
* Loki (cluster logs)
* Velero (S3/compatible backups)
* CloudNativePG (Postgres operator)

**Worker fleet (e.g., 15 servers)**

* Application workloads (per namespace/app)
* Optional Longhorn data plane
* Tailscale agent for admin access

**Networking note:** avoid overlay-on-overlay for data plane traffic. Keep Tailscale for operator access; let the Kubernetes CNI carry pod traffic.

---

## Multi-Tenancy & Isolation

Per application (or tenant), create a **separate namespace** with:

* **ResourceQuotas** and **LimitRanges** to prevent noisy-neighbor issues
* **NetworkPolicies** to default-deny and allow only what is needed
* **Dedicated Ingress/hostnames**, separate secrets
* A **database cluster** per app or per tenant group, managed by CloudNativePG
* Independent **HPA/KEDA policies**

Minimal default-deny policy:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
```

---

## Deployment Workflow (GitOps)

1. CI builds and pushes images (tagged).
2. A Git repository stores Kubernetes manifests/Helm values.
3. **Argo CD** monitors the repo and syncs changes automatically (or on PR merge).
4. **Traefik** routes traffic to the new pods after readiness passes.
5. **KEDA/HPA** adjust replicas to match demand.

Minimal Argo CD Application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: saas-platform
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/infrastructure
    targetRevision: main
    path: kubernetes/apps
  destination:
    server: https://kubernetes.default.svc
    namespace: apps
  syncPolicy:
    automated: { prune: true, selfHeal: true }
```

---

## Autoscaling Patterns

**CPU/memory** with HPA for general web APIs.
**Event-driven** with KEDA for queues, schedules, or request-rate targets.

Example KEDA ScaledObject (Prometheus rate):

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: api-scaler
spec:
  minReplicaCount: 2
  maxReplicaCount: 50
  scaleTargetRef:
    name: api-deployment
  triggers:
    - type: prometheus
      metadata:
        serverAddress: http://victoria-metrics.monitoring.svc:8428
        query: sum(rate(http_requests_total[30s]))
        threshold: "100"
```

**Guardrails**

* Start with `replicas: 3` for stateless web tiers.
* Use **PodDisruptionBudgets** to keep at least 2 pods available during maintenance/rollouts.
* Add **topologySpreadConstraints** to distribute replicas across nodes.

---

## Observability & Alerting

**Metrics & dashboards**

* VictoriaMetrics scrapes at short intervals and stores long-term data efficiently.
* Grafana provides per-service and per-node dashboards.
* Recording rules pre-compute expensive SLO queries.

**Alerting**

* Alertmanager routes to **Telegram/Slack/PagerDuty**.
* Recommended symptom-based alerts: error rate over SLO, latency p95 over threshold, disk space low, certificate nearing expiration, backup job failed.

**Logs**

* **Loki** stores logs without heavy indexing.
* Promtail or Vector ships container logs; Grafana links metrics ↔ logs for fast triage.

---

## Backup & Recovery

**Cluster/PV** — **Velero** backups to S3/compatible storage on a schedule (retain according to policy).
**Postgres** — **CloudNativePG** clusters with:

* Synchronous or async replication (multiple replicas)
* Continuous WAL archiving to S3
* Periodic base backups
* Declarative restore jobs for **point-in-time** recovery

**Optional block-storage layer** — **Longhorn** for replicated volumes and automated S3 snapshot backups per volume.

---

## Operational Defaults (that prevent 3 AM surprises)

* **Replicas**: web/API `replicas: 3` minimum; background workers sized by queue throughput.
* **Probes**: readiness < 2s; liveness conservative to avoid flapping.
* **Rollouts**: `maxSurge: 1`, `maxUnavailable: 0` for zero-downtime updates.
* **Budgets & spread**: PDB `minAvailable: 2`; topology spread across nodes/hosts.
* **Resources**: set both requests and limits for CPU/memory.

Minimal resource block:

```yaml
resources:
  requests: { cpu: "100m", memory: "256Mi" }
  limits:   { cpu: "1000m", memory: "512Mi" }
```

---

## Security Essentials

* **NetworkPolicies**: default-deny, explicit allow lists.
* **Secrets**: consider **External Secrets Operator**, **Sealed Secrets**, or **SOPS** for Git-friendly encryption.
* **Supply chain**: image scanning (e.g., Trivy), admission policies (e.g., Gatekeeper), image signing (e.g., Cosign).

---

## Migration Path (incremental, low risk)

1. Stand up **K3s HA** and Traefik with cert-manager/ExternalDNS.
2. Add **Argo CD** and migrate stateless apps via Helm/manifest repos.
3. Layer **KEDA** for event-driven autoscaling.
4. Move databases to **CloudNativePG** with backups/PITR.
5. Complete observability with **VictoriaMetrics stack** and **Loki**.
6. Optionally add **Longhorn** for replicated PVs.

---

## Practical Outcome

* Git push updates desired state → Argo CD syncs → zero-downtime rollout.
* Traffic spikes → HPA/KEDA scale replicas.
* Node failures → workloads reschedule automatically.
* Data incidents → restore with Velero or recover databases to a point in time.
* Incidents → alerts arrive in Telegram/Slack with links to Grafana dashboards.
* Upgrades → K3s binary update + Helm chart bumps in Git.

---

## Conclusion

This stack assembles **lightweight components** that are widely deployed in production and intentionally conservative in design. The result is **predictable reliability** with **minimal day-to-day fuss**: declarative deployments, meaningful autoscaling, automated TLS/DNS, comprehensive telemetry, and robust backups. It fits small servers, scales cleanly, and keeps operations boring—exactly what production infrastructure should be.
