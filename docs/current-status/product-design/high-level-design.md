# High-Level Design (HLD)

Status date: 2026-04-12

## Module Decomposition

### Applications

- `apps/customer-web`
  - customer authentication
  - customer dashboard and navigation shell
  - instance detail
  - messages, settings, subscription, and API docs pages

- `apps/admin-web`
  - admin authentication
  - users, workspaces, workers, instances, support, audit, and messages pages

- `apps/api`
  - authentication
  - customer dashboard endpoints
  - admin endpoints
  - internal endpoints
  - public instance/account API endpoints

- `apps/worker`
  - worker heartbeat and health
  - instance runtime/session handling
  - queue-backed operations

### Shared packages

- `packages/config`: environment parsing and logger-related configuration
- `packages/contracts`: shared Zod contracts
- `packages/db`: Prisma client and schema
- `packages/ui`: shared UI primitives and shell components

## System Boundaries

- Web apps do not speak to the database directly.
- The worker does not own customer-facing UI concerns.
- The API is the primary integration boundary for customer UI, admin UI, and external API use.
- Shared packages keep config, schema, and UI conventions centralized.

## Major Data Domains

- identity and sessions
- tenancy and membership
- instances and runtime
- messages and delivery
- tokens and webhook delivery
- workers and support
- auditability and retention

## HLD Decisions

- separate admin and customer experiences instead of one overloaded application
- use workspace and instance as core business abstractions
- distinguish internal instance UUIDs from public API instance IDs
- keep long-running runtime work out of synchronous HTTP request handling
