---
title: "Running 9 Services on Bare Metal K8s: What Actually Worked"
published_at: "2025-08-05"
snippet: "I deployed a production k8s cluster on a single bare metal server. Here's what worked, what didn't, and the code that made it happen."
tags: ["kubernetes", "devops"]
---

Migrating from a bunch of Docker-compose files setup, I deployed a production Kubernetes cluster on a single bare metal server. Here's what worked, what didn't, and the code that made it happen.

## The Architecture

```mermaid
graph TD
    A["External Traffic<br/>git.arcbjorn.com<br/>analytics.arcbjorn.com<br/>dashboard.arcbjorn.com"] --> B["iptables bypass<br/>DOCKER-STYLE-HTTP/HTTPS-BYPASS<br/>(Ports 80/443)"]
    B --> C["nginx-ingress (hostNetwork)<br/>Standard controller + individual<br/>SSL certificates"]
    C --> D["Kubernetes Services<br/>ClusterIP → Application Pods"]
    D --> E["PostgreSQL StatefulSet<br/>Shared database with multiple DBs"]

    style A fill:#3c3836,stroke:#a89984,stroke-width:2px,color:#ebdbb2
    style B fill:#3c3836,stroke:#a89984,stroke-width:2px,color:#ebdbb2
    style C fill:#3c3836,stroke:#a89984,stroke-width:2px,color:#ebdbb2
    style D fill:#3c3836,stroke:#a89984,stroke-width:2px,color:#ebdbb2
    style E fill:#3c3836,stroke:#a89984,stroke-width:2px,color:#ebdbb2
```

**Stack**: K8s v1.29.15, single node, 9 services sharing one PostgreSQL, individual Let's Encrypt certs per domain.

## Base Setup

Skip the boring install stuff. Here's what matters:

```bash
# Remove control-plane taint for single node
kubectl taint nodes --all node-role.kubernetes.io/control-plane-

# Install Calico CNI
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/tigera-operator.yaml
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/custom-resources.yaml
```

Why Calico? [Their eBPF dataplane](https://docs.tigera.io/calico/latest/about/kubernetes-training/about-ebpf) is fast and the network policies actually work.

## Storage: The Local PV Trap

Everyone says "don't use hostPath in production." Here's why they're wrong (sometimes):

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer  # Critical for node affinity
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: gitea-pv
spec:
  capacity:
    storage: 512Mi
  accessModes:
  - ReadWriteOnce
  storageClassName: local-storage
  hostPath:
    path: /root/containers/gitea-k8s-data
  nodeAffinity:  # Ensures pod schedules on same node as data
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - your-node-name
```

The trick? `WaitForFirstConsumer` + node affinity. Without this, your pod might schedule on a different node than your data (learned this the hard way).

For multi-node, check out [Longhorn](https://longhorn.io/) or [OpenEBS](https://openebs.io/).

## Database: StatefulSet vs Deployment

Why StatefulSet for PostgreSQL? Stable network identity and ordered startup:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql
  namespace: base-infra
spec:
  serviceName: postgresql-headless  # Headless service for stable DNS
  replicas: 1
  template:
    spec:
      containers:
      - name: postgresql
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: POSTGRES_PASSWORD
        - name: PGDATA  # Custom data directory to avoid permission issues
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: postgresql-data
          mountPath: /var/lib/postgresql/data
        - name: init-scripts
          mountPath: /docker-entrypoint-initdb.d
        livenessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - exec pg_isready -U "$POSTGRES_USER" -h 127.0.0.1
          initialDelaySeconds: 30
          periodSeconds: 10
      volumes:
      - name: init-scripts
        configMap:
          name: postgresql-init-scripts
```

Init script with proper permissions:
```sql
-- ConfigMap: postgresql-init-scripts
CREATE DATABASE gitea;
CREATE DATABASE umami;

CREATE USER gitea_user WITH PASSWORD 'xxx';
GRANT ALL PRIVILEGES ON DATABASE gitea TO gitea_user;

-- Critical: Grant schema permissions for Postgres 15+
\c gitea;
GRANT ALL ON SCHEMA public TO gitea_user;
```

Without that schema grant, you'll get permission denied errors that make no sense.

## The UFW Bypass That Actually Works

UFW and Kubernetes don't play nice. Docker solved this years ago by bypassing UFW entirely. Here's the same trick:

```bash
# These go BEFORE UFW rules in the iptables chain
iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT -m comment --comment "K8S-HTTPS"
iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT -m comment --comment "K8S-HTTP"

# Make it persistent (Ubuntu/Debian)
apt-get install iptables-persistent
netfilter-persistent save
```

Why position 1 matters:
```
Chain INPUT (policy ACCEPT)
1    ACCEPT     tcp  --  0.0.0.0/0    0.0.0.0/0    tcp dpt:443 /* K8S-HTTPS */
2    ACCEPT     tcp  --  0.0.0.0/0    0.0.0.0/0    tcp dpt:80 /* K8S-HTTP */
3    ufw-before-logging-input  all  --  0.0.0.0/0    0.0.0.0/0
```

Your rules execute before UFW even sees the packets. [This netfilter flow diagram](https://en.wikipedia.org/wiki/Netfilter#/media/File:Netfilter-packet-flow.svg) shows why.

## Ingress: Why hostNetwork Changes Everything

Standard nginx-ingress uses NodePort. On bare metal, that means ugly `:30000` URLs. hostNetwork fixes this:

```bash
# Install standard controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Patch for hostNetwork
kubectl patch deployment ingress-nginx-controller -n ingress-nginx --type='json' -p='[
  {"op": "add", "path": "/spec/template/spec/hostNetwork", "value": true},
  {"op": "replace", "path": "/spec/template/spec/dnsPolicy", "value": "ClusterFirstWithHostNet"}
]'
```

The `ClusterFirstWithHostNet` is crucial - without it, your controller can't resolve cluster DNS.

## SSL: Individual Certs and ACME Challenges

Multi-domain SAN certificates seem smart until nginx starts serving the wrong cert to the wrong domain. Individual certs fix this:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: base-infra-ingress
  namespace: base-infra
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"  # For Gitea
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - git.arcbjorn.com
    secretName: git-arcbjorn-tls  # One cert per domain
  - hosts:
    - analytics.arcbjorn.com
    secretName: analytics-arcbjorn-tls
  rules:
  - host: git.arcbjorn.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gitea
            port:
              number: 3000
```

The cert-manager webhook timing issue is real. This fixes it:
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml

# Wait for webhook with exponential backoff
for i in {1..10}; do
  kubectl wait --for=condition=available --timeout=30s deployment/cert-manager-webhook -n cert-manager && break
  echo "Attempt $i failed, waiting..."
  sleep $((i * 2))
done

# Verify webhook is answering
kubectl apply --dry-run=server -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: test
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
EOF
```

If the dry-run fails, your webhook isn't ready. Don't proceed.

## Service Patterns That Actually Scale

Connection pooling for database-heavy apps:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: umami
spec:
  template:
    spec:
      containers:
      - name: umami
        image: ghcr.io/umami-software/umami:postgresql-latest
        env:
        - name: DATABASE_URL
          value: "postgresql://umami_user:xxx@postgresql:5432/umami?sslmode=disable&poolsize=20"
        - name: DATABASE_TYPE
          value: "postgresql"
        livenessProbe:
          httpGet:
            path: /api/heartbeat
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/heartbeat
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

That `poolsize=20` prevents connection exhaustion. Default is often too low.

## Debugging Tools That Save Time

When things break (they will), these help:

```bash
# See what nginx-ingress is actually doing
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller -f

# Check certificate status
kubectl get certificate -A
kubectl describe challenge -A  # For ACME debugging

# Test service resolution from inside cluster
kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot
> nslookup postgresql.base-infra.svc.cluster.local
> curl -v http://gitea.base-infra.svc.cluster.local:3000

# Check iptables rules are actually working
iptables -L INPUT -n -v --line-numbers | head -20

# PostgreSQL connection test
kubectl exec -it postgresql-0 -n base-infra -- psql -U postgres -c "\l"
```

## The Admission Webhook Nightmare

This error will haunt you:
```
Error from server (InternalError): error when creating "ingress.yaml": 
Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io"
```

Fix it properly:
```bash
# Nuclear option when webhooks are broken
kubectl delete validatingwebhookconfigurations --all
kubectl delete mutatingwebhookconfigurations --all

# Reinstall ingress-nginx
kubectl delete namespace ingress-nginx
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Wait properly this time
kubectl wait --for=condition=available --timeout=300s deployment/ingress-nginx-controller -n ingress-nginx
```

## Automation That Actually Works

```bash
#!/bin/bash
set -e  # Fail on any error

wait_for_condition() {
    local name=$1
    local condition=$2
    local timeout=${3:-300}
    
    echo "⏳ Waiting for $name..."
    if timeout $timeout bash -c "until $condition; do sleep 1; done"; then
        echo "✅ $name ready"
    else
        echo "❌ $name failed"
        exit 1
    fi
}

# Create namespace first
kubectl apply -f k8s/namespace/

# Storage and secrets
kubectl apply -f k8s/storage/
kubectl apply -f k8s/secrets/

# PostgreSQL with proper wait
kubectl apply -f k8s/postgresql/
wait_for_condition "PostgreSQL" \
    "kubectl get pod -l app=postgresql -n base-infra -o jsonpath='{.items[0].status.conditions[?(@.type==\"Ready\")].status}' | grep -q True"

# Verify PostgreSQL is accepting connections
wait_for_condition "PostgreSQL connections" \
    "kubectl exec postgresql-0 -n base-infra -- pg_isready -U postgres"

# Deploy services
kubectl apply -f k8s/services/

# Cert-manager with proper webhook wait
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml
wait_for_condition "cert-manager webhook" \
    "kubectl get endpoints cert-manager-webhook -n cert-manager -o jsonpath='{.subsets[0].addresses[0].ip}' 2>/dev/null | grep -q ."

# Test webhook is responding
wait_for_condition "webhook validation" \
    "kubectl apply --dry-run=server -f k8s/cert-manager/cluster-issuer.yaml"

kubectl apply -f k8s/cert-manager/
kubectl apply -f k8s/ingress/
```

## What's Next: Building Your Own Cloud

Now that the foundation is solid, here's what I'm adding:

### Object Storage (S3 Alternative)
[MinIO](https://min.io/) is the obvious choice. Single binary, S3-compatible API, works great with existing tools:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minio
spec:
  template:
    spec:
      containers:
      - name: minio
        image: minio/minio:latest
        args:
        - server
        - /data
        - --console-address
        - ":9001"
        env:
        - name: MINIO_ROOT_USER
          value: minioadmin
        - name: MINIO_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: minio-secret
              key: password
        volumeMounts:
        - name: storage
          mountPath: /data
```

Pro tip: Use [Garage](https://garagehq.deuxfleurs.fr/) if you want distributed storage across multiple nodes. It's lighter than MinIO's distributed mode.

### CI/CD Pipeline
Gitea is already running. Add [Drone CI](https://www.drone.io/) or [Woodpecker CI](https://woodpecker-ci.org/) (Drone fork without the license drama):

```yaml
# Woodpecker server talks to Gitea
env:
- name: WOODPECKER_GITEA
  value: "true"
- name: WOODPECKER_GITEA_URL
  value: "https://git.arcbjorn.com"
- name: WOODPECKER_GITEA_CLIENT
  valueFrom:
    secretKeyRef:
      name: woodpecker-secret
      key: gitea-client-id
```

Both integrate directly with Gitea OAuth. Your own GitHub Actions, basically.

### Media Server
[Jellyfin](https://jellyfin.org/) for streaming, [PhotoPrism](https://photoprism.app/) for photos. Mount a large disk and let Kubernetes handle the rest:

```yaml
# PhotoPrism with face recognition and AI tagging
- name: PHOTOPRISM_TENSORFLOW_ENABLED
  value: "true"
- name: PHOTOPRISM_DETECT_FACES
  value: "true"
```

### Monitoring Stack
The classics still work best:
- [VictoriaMetrics](https://victoriametrics.com/) instead of Prometheus (uses 10x less RAM)
- [Grafana](https://grafana.com/) for dashboards
- [Loki](https://grafana.com/oss/loki/) for logs

```bash
# One-liner for basic monitoring
helm install vmagent vm/victoria-metrics-agent -f values.yaml
```

### Serverless Functions
[OpenFaaS](https://www.openfaas.com/) or [Knative](https://knative.dev/). I prefer OpenFaaS for simplicity:

```bash
arkade install openfaas
```

Yes, [arkade](https://github.com/alexellis/arkade). It actually makes OpenFaaS installation trivial.

### The Reverse Proxy Problem
When you add more services, nginx-ingress config gets messy. Consider [Traefik](https://traefik.io/) with its automatic service discovery:

```yaml
# Traefik picks this up automatically
annotations:
  traefik.ingress.kubernetes.io/router.entrypoints: websecure
  traefik.ingress.kubernetes.io/router.middlewares: default-compress@kubernetescrd
```

### GPU Workloads
If you have a GPU, add the [NVIDIA device plugin](https://github.com/NVIDIA/k8s-device-plugin) and run your own:
- [LocalAI](https://localai.io/) - OpenAI-compatible API for local LLMs
- [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) in a container
- [Frigate](https://frigate.video/) for security camera AI detection

```yaml
resources:
  limits:
    nvidia.com/gpu: 1  # Request one GPU
```

### The Backup Strategy That Actually Works
[Velero](https://velero.io/) backs up both Kubernetes resources and persistent volumes:

```bash
velero backup create daily-backup --schedule="0 2 * * *"
```

Combine with [Restic](https://restic.net/) for deduplication. Ship backups to your MinIO instance or external S3.

### Service Mesh (When You're Ready)
Start with [Linkerd](https://linkerd.io/). It's simpler than Istio:

```bash
linkerd install --crds | kubectl apply -f -
linkerd install | kubectl apply -f -
```

Automatic mTLS between services, circuit breaking, and observability. Worth it when you hit 20+ services.

## Resources That Actually Help

- [Kubernetes Network Debugging](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/) - Official guide that's actually good
- [nginx-ingress Bare Metal Considerations](https://kubernetes.github.io/ingress-nginx/deploy/baremetal/) - Read this twice
- [cert-manager Troubleshooting](https://cert-manager.io/docs/troubleshooting/) - Bookmark the ACME section
- [StatefulSet vs Deployment](https://www.baeldung.com/ops/kubernetes-deployment-vs-statefulset) - When to use what
- [iptables Deep Dive](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands) - Understand the chain precedence
- [Awesome Self-Hosted](https://github.com/awesome-selfhosted/awesome-selfhosted) - For service ideas

