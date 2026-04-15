# Database Schema Documentation

Status date: 2026-04-12

## Primary Technology

- Database: PostgreSQL
- Access layer: Prisma 7
- Schema source: `packages/db/prisma/schema.prisma`

## Core Entity Groups

### Identity and tenancy

- `User`
- `Workspace`
- `Membership`
- `RefreshSession`
- `ApiToken`

### Runtime and lifecycle

- `Instance`
- `InstanceSettings`
- `InstanceRuntimeState`
- `InstanceOperation`
- `InstanceLifecycleEvent`

### Messaging and webhook delivery

- `OutboundMessage`
- `OutboundMessageAttempt`
- `InboundMessage`
- `WebhookDelivery`

### Operations and governance

- `WorkerHeartbeat`
- `AuditLog`
- `SupportCase`

## Key Relationships

- one user can have many memberships
- one workspace can have many memberships, instances, tokens, audit logs, and support cases
- one instance belongs to one workspace and can have settings, runtime state, operations, messages, webhook deliveries, lifecycle events, and tokens
- outbound messages can have many attempts and optional related webhook deliveries

## Important Enums

- `UserRole`, `UserStatus`
- `WorkspaceStatus`, `MembershipRole`
- `InstanceLifecycleStatus`, `InstanceOperationType`, `InstanceOperationStatus`
- `OutboundMessageType`, `MessageDeliveryStatus`, `MessageDeliveryAck`
- `WebhookEventType`, `WebhookDeliveryStatus`
- `WorkerStatus`
- `SupportCaseStatus`, `SupportCasePriority`

## Schema Design Notes

- API tokens are stored hashed, with prefix metadata retained for user-facing display.
- Instances have both internal UUIDs and public IDs for API use.
- Runtime state is separated from core instance metadata.
- Audit and support entities are first-class records rather than freeform logs.

## Important Indexes

- membership uniqueness on workspace/user
- refresh session index on user and expiry
- token indexes by workspace/instance and token type
- message indexes by instance, status, schedule, reference, recipient, and sender
- webhook delivery indexes by status and retry schedule
- audit/support indexes by status, actor, entity, workspace, and instance

## Reference

For a longer schema walkthrough, see the existing reference doc:

- [Existing database schema reference](/Volumes/MACOS/EliteMessage/docs/elite-message-database-schema.md)
