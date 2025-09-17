---
title: Running Dokploy in Kubernetes
published_at: 2025-09-17 13:00
snippet: A Hybrid Architecture for Modern Deployments
tags: [linux, k8s]
---

[Dokploy](https://dokploy.com) is an open-source deployment platform that serves as an alternative to Heroku,
  Vercel, and Netlify. Unlike traditional platforms, Dokploy functions purely as a
  deployment and management tool rather than a traffic proxy. This architectural decision
  makes it an excellent candidate for running in Kubernetes as a centralized management
  layer.

  Architecture Overview

  Management Layer (Kubernetes Cluster)
  ├── Dokploy UI (infra.example.com)
  ├── PostgreSQL (shared database)
  └── Redis (session storage)
      │
      └── Manages ↓

  Production Servers (Direct Traffic)
  ├── app.example.com → Server 1 (Docker Swarm)
  ├── api.example.com → Server 2 (Docker Swarm)
  └── dashboard.example.com → Server 3 (Docker Swarm)

  Traffic Patterns: Control vs Data Plane

  The separation between management and production traffic creates distinct pathways:

  Control Plane Traffic:
  Operators → infra.example.com → K8s Cluster → Dokploy UI

  Data Plane Traffic:
  End Users → app.example.com → Remote Server 1 (direct)
  End Users → api.example.com → Remote Server 2 (direct)

  This separation ensures zero latency overhead for production workloads while maintaining
  centralized operational control.

  Benefits of K8s-Hosted Management

  Resource Consolidation: The Dokploy management interface leverages existing Kubernetes
  infrastructure including databases, ingress controllers, and monitoring systems.

  Operational Consistency: Management follows standard kubectl workflows alongside other
  infrastructure components.

  Geographic Flexibility: Centralized management can coordinate deployments across
  geographically distributed edge servers.

  Fault Isolation: Infrastructure management remains operational even during production
  server maintenance or outages.

  SSL Certificate Management

  The dual-layer architecture requires SSL handling at two levels:

  Management Layer: Kubernetes cert-manager handles certificate lifecycle for the Dokploy
  interface.

  Production Layer: Each remote server runs Traefik, which automatically manages Let's
  Encrypt certificates for application domains. The process includes:
  - Automatic certificate requests via ACME protocol
  - SSL termination and renewal
  - HTTP to HTTPS redirects

  Certificate management operates independently per server, eliminating single points of
  failure.

  CI/CD Integration Patterns

  Dokploy supports multiple deployment workflows:

  Integrated Pipeline:
  Git Push → Dokploy → Build → Deploy → Remote Servers

  Hybrid Pipeline:
  Git Push → External CI → Container Registry
                ↓
  Dokploy → Registry Pull → Deploy → Remote Servers

  The hybrid approach allows teams to maintain existing CI investments while leveraging
  Dokploy's deployment capabilities. Features include zero-downtime rolling updates,
  automatic rollbacks based on health checks, and horizontal scaling during deployments.

  Data Persistence and Backup Strategy

  Dokploy's backup system integrates with multiple storage backends:
  - S3-compatible object storage (AWS S3, MinIO, DigitalOcean Spaces)
  - Google Cloud Storage
  - Azure Blob Storage
  - Traditional FTP/SFTP endpoints

  Backup configuration supports:
  - Automated scheduling (daily, weekly, monthly intervals)
  - Configurable retention policies
  - Encryption in transit and at rest
  - One-click restoration through the management interface

  Each production server manages its backup strategy independently, providing both
  operational flexibility and fault isolation.

  Production Characteristics

  The decoupled architecture provides several operational advantages:

  Management Plane Independence: Production applications continue serving traffic regardless
   of Dokploy or Kubernetes cluster status.

  Selective Impact: Issues affecting individual remote servers remain isolated from the
  broader application portfolio.

  Maintenance Windows: Infrastructure and application maintenance can be scheduled
  independently.

  Implementation Considerations

  Deployment involves standard Kubernetes manifests for the Dokploy service, database
  connections, and ingress configuration. Remote server connectivity uses Dokploy's built-in
   server management interface.

  This architectural pattern combines Kubernetes' orchestration capabilities for
  infrastructure management with Dokploy's streamlined application deployment workflow. The
  result is a scalable platform that maintains direct traffic paths for optimal performance
  while providing centralized operational control.

  The approach particularly benefits teams managing multiple applications across diverse
  environments, offering both the operational consistency of Kubernetes and the deployment
  simplicity of modern PaaS platforms.
