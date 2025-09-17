---
title: Integrating Tailscale with Dokploy in K8s
published_at: 2025-09-17 14:00
snippet: Sidecar Approach
tags: [linux, k8s]
---

[Dokploy](https://dokploy.com), a self-hosted deployment platform, typically requires direct network access to target servers for SSH-based deployments. However, when target servers are only accessible via a private [Tailscale](https://tailscale.com) network, the containerized Dokploy instance faces connectivity limitations.

The containerized Dokploy instance faces connectivity limitations when target servers are only accessible via a private Tailscale network, requiring a solution that doesn't modify the core application.

## Tailscale Sidecar Pattern

Rather than building a custom Dokploy image with Tailscale embedded, a cleaner approach involves deploying Tailscale as a sidecar container alongside Dokploy in the same Kubernetes pod.

Two containers sharing the same network namespace:

```yaml
containers:
- name: dokploy
  image: dokploy/dokploy:latest
- name: tailscale
  image: tailscale/tailscale:stable
```

**Network Namespace Sharing:** Both containers operate within the same pod network namespace. When the Tailscale container establishes a VPN tunnel, the Dokploy container automatically gains access to the Tailscale network without modification.

**TUN Device Access:** The Tailscale sidecar requires `/dev/net/tun` access and `NET_ADMIN`/`NET_RAW` capabilities to create the VPN interface:

```yaml
securityContext:
  runAsUser: 0
  capabilities:
    add: ["NET_ADMIN", "NET_RAW"]
volumeMounts:
- name: dev-net-tun
  mountPath: /dev/net/tun
```

**State Management:** Tailscale persists connection state using Kubernetes secrets, eliminating the need for host-mounted volumes:

```yaml
env:
- name: TS_KUBE_SECRET
  value: dokploy-tailscale-state
- name: TS_AUTHKEY
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: TAILSCALE_AUTHKEY
```

**RBAC Requirements:** The Tailscale container needs permissions to manage its state secret:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: tailscale
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "update", "create", "patch"]
```

## Benefits of the Sidecar Approach

**Separation of Concerns:** Dokploy handles deployment logic while Tailscale manages VPN connectivity. Neither component needs modification.

**Maintainability:** Updates to either Dokploy or Tailscale can be applied independently without rebuilding custom images.

**Security:** The pod runs with minimal required privileges, and Tailscale state is managed securely within Kubernetes.

**Transparency:** From Dokploy's perspective, target servers appear as directly accessible hostnames (e.g., `server:2222`), with DNS resolution handled by Tailscale.

Once deployed, connectivity can be verified from within the Dokploy container:

```bash
kubectl exec dokploy-pod -c dokploy -- curl -v telnet://server:2222
# Output: Connected to server (or IP) port 2222
```

The Tailscale connection status confirms network integration:

```bash
kubectl exec dokploy-pod -c tailscale -- tailscale status
# Shows all Tailscale nodes including the target server
```

---

The sidecar pattern provides an elegant solution for integrating Tailscale connectivity with existing containerized applications. This approach maintains clean architectural boundaries while enabling secure access to private networks without requiring application-level changes or custom container images.
