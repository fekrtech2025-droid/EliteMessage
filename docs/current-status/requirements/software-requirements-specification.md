# Software Requirements Specification (SRS)

Status date: 2026-04-12

## 1. Scope

Elite Message is a multi-application software system composed of customer UI, admin UI, API services, and a worker runtime for managing WhatsApp-linked messaging instances.

## 2. System Context

Primary components:

- customer web application
- admin web application
- API service
- worker service
- PostgreSQL database
- Redis queue
- MinIO object storage
- observability stack

## 3. Users

- customer user
- platform admin
- support/operator
- backend integrator using the public API

## 4. External Interfaces

- HTTP/JSON APIs
- browser-based web UIs
- Google OAuth
- S3-compatible storage
- Prometheus-compatible metrics scraping

## 5. Major Software Functions

- authentication and session management
- workspace and membership management
- instance creation and lifecycle control
- outbound and inbound messaging data handling
- webhook delivery tracking and replay-capable operations
- support and audit workflows
- admin worker monitoring and intervention

## 6. Design Constraints

- TypeScript monorepo architecture
- PostgreSQL as the system of record
- Next.js for both web surfaces
- NestJS API
- BullMQ/Redis for queue-backed worker operations

## 7. Assumptions

- local/docker development remains a supported primary workflow
- customer-facing APIs remain versioned under `/api/v1`
- worker runtime is required for real instance operation beyond static UI state

## 8. Quality Targets

- typed boundaries between packages
- operational traceability through audit and lifecycle records
- sufficiently clear UI flows for customer self-service
- documented security controls for tokens, sessions, and admin access
