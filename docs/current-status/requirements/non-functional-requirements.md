# Non-Functional Requirements

Status date: 2026-04-12

## Performance

- NFR-001: The web applications should keep primary navigation responsive under normal local and staging loads.
- NFR-002: The API should support concurrent customer/admin UI access and worker traffic without blocking the request path on long-running operations.
- NFR-003: Queue-backed operations should be handled asynchronously through Redis/BullMQ rather than long-running UI requests.

## Availability and resilience

- NFR-004: The system should degrade gracefully when external services such as Google OAuth are not configured.
- NFR-005: Worker unavailability should be visible through worker heartbeat and lifecycle status data.
- NFR-006: Health and metrics endpoints should be exposed for operational inspection.

## Security

- NFR-007: Access tokens, refresh sessions, and API tokens must be handled securely and never expose raw secret values except at creation/rotation boundaries.
- NFR-008: Customer and admin roles must remain separated by route and API authorization checks.
- NFR-009: Admin accounts should support MFA.
- NFR-010: Public APIs should remain rate-limited and versioned.

## Maintainability

- NFR-011: Shared contracts and typed configuration should be used across apps and packages.
- NFR-012: Core domain entities should remain centralized in the Prisma schema.
- NFR-013: Documentation should distinguish between current-state implementation and target-state planning.

## Observability

- NFR-014: The system should emit metrics compatible with Prometheus scraping.
- NFR-015: The local development environment should support Grafana and Alertmanager configuration.
- NFR-016: Audit and lifecycle records should be retained for operational diagnosis.

## Usability

- NFR-017: Customer workflows should prioritize clarity for signup, signin, instance setup, token retrieval, and API usage.
- NFR-018: Admin workflows should prioritize scanability for users, workspaces, workers, messages, support, and audit records.
- NFR-019: Loading, empty, error, and session-expired states should be visibly distinct and recoverable.

## Portability

- NFR-020: The platform should run locally through Docker-based infra plus node processes.
- NFR-021: Environment configuration should remain externalized through `.env` variables.
