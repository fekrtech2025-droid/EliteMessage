# Low-Level Design (LLD)

Status date: 2026-04-12

## Customer Web

Current route set includes:

- `/`
- `/signup`
- `/messages`
- `/settings`
- `/subscription`
- `/api-documents`
- `/instances/[id]`
- `/auth/google`

Current client concerns include:

- auth/session handling
- workspace-aware shell and topbar/sidebar navigation
- navigation progress behavior
- API documentation rendering with language examples
- instance credential handling in browser session state

## Admin Web

Current route set includes:

- `/`
- `/messages`
- `/users`
- `/workspaces`
- `/workers`
- `/workers/[id]`
- `/instances/[id]`
- `/support`
- `/audit`

Current client concerns include:

- admin login and MFA flows
- operational explorer pages
- worker and instance inspection
- support and audit review

## API

Current API concerns include:

- login, signup, refresh, Google auth callback, and admin MFA-related flows
- customer dashboard routes
- admin routes
- public instance/account API routes
- health, readiness, and metrics
- internal coordination endpoints

## Worker

Current worker concerns include:

- heartbeat reporting
- runtime session state management
- queued operation execution
- WhatsApp backend integration through `whatsapp-web.js`
- local health endpoint

## Data Layer

- Prisma schema in `packages/db/prisma/schema.prisma`
- PostgreSQL source of truth
- relation-heavy model centered on `User`, `Workspace`, `Membership`, and `Instance`

## Observability Layer

- Prometheus scrape config
- Alertmanager config
- Grafana dashboard provisioning

## LLD Observation

The codebase favors clear package boundaries and shared TypeScript contracts, but some domain logic is still spread across UI clients, API endpoints, and worker behavior. That is normal at current maturity and should be documented rather than hidden.
