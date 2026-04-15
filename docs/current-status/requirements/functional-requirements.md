# Functional Requirements

Status date: 2026-04-12

## Identity and access

- FR-001: The system shall allow customer users to sign up with email and password.
- FR-002: The system shall allow customer users to sign in with email and password.
- FR-003: The system shall support Google OAuth for customer authentication when configured.
- FR-004: The system shall allow platform admins to sign in through a dedicated admin surface.
- FR-005: The system shall support MFA-capable admin authentication flows.

## Workspace and tenancy

- FR-006: The system shall persist workspaces and memberships.
- FR-007: The system shall allow customer users to access only workspaces where they have membership.
- FR-008: The system shall allow admins to inspect and manage workspaces globally.
- FR-009: The system shall store workspace status and trial metadata.

## Instance lifecycle

- FR-010: The system shall allow customer users to create instances.
- FR-011: The system shall assign each instance both an internal UUID and a public API instance ID.
- FR-012: The system shall store lifecycle status and substatus for each instance.
- FR-013: The system shall expose instance runtime state including QR-related data and timestamps.
- FR-014: The system shall support lifecycle operations such as start, stop, restart, logout, clear, takeover, and reassign.
- FR-015: The system shall record lifecycle events and operations historically.

## Messaging

- FR-016: The system shall store outbound message records.
- FR-017: The system shall store inbound message records.
- FR-018: The system shall store outbound delivery attempts and acknowledgements.
- FR-019: The system shall support customer and admin message explorer views.
- FR-020: The system shall support public API message sending through instance-scoped routes.

## Webhooks

- FR-021: The system shall persist webhook delivery records by event type and delivery status.
- FR-022: The system shall support signed webhook delivery semantics through instance secrets.
- FR-023: The system shall expose admin visibility into webhook deliveries.
- FR-024: The system shall support replay-capable webhook operations through the admin/API surface where implemented.

## Tokens and API access

- FR-025: The system shall support account-level API tokens.
- FR-026: The system shall support instance-level API tokens.
- FR-027: The system shall expose token metadata without storing raw token values after creation/rotation.
- FR-028: The customer UI shall explain how to use the API with practical code examples.

## Admin operations

- FR-029: The system shall expose admin routes for users, workspaces, workers, support, audit, messages, and instance detail.
- FR-030: The system shall store worker heartbeat data and status.
- FR-031: The system shall store support cases and assignment metadata.
- FR-032: The system shall store audit log records for major platform actions.

## Operational support

- FR-033: The system shall expose health and metrics endpoints.
- FR-034: The system shall support rate limiting controls through configuration.
- FR-035: The system shall support retention settings for sessions, audit logs, and webhook deliveries.
