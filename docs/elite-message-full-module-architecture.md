# Elite Message

## Full Module Architecture

Version: 1.0  
Prepared for: Elite Message project  
Architecture target: UltraMsg-equivalent platform with customer dashboard, admin dashboard, per-instance WhatsApp sessions, realtime status, queueing, webhook delivery, and subscription control

---

## 1. Objective

Elite Message should be built as a hosted messaging platform that reproduces the operational behavior of UltraMsg as closely as practical:

- multi-tenant customer accounts
- multiple WhatsApp instances per account
- QR-based instance authorization
- long-lived per-instance sessions
- per-instance API tokens
- outbound send APIs for text and media
- inbound event capture and webhook delivery
- queueing with priority and delays
- realtime dashboard updates
- admin tooling for support, operations, worker health, and abuse control

This document defines the full module architecture for that platform.

---

## 2. Architecture Principles

The system should follow these principles:

- isolate the WhatsApp runtime from the business application
- keep all customer and admin actions behind a control-plane API
- treat each instance as an independently managed session unit
- use queues for anything asynchronous or retryable
- store every meaningful state transition as an event or audit trail
- separate customer-facing UI from internal operations UI
- assume worker crashes, browser corruption, and network instability will happen
- design for horizontal scaling from the first version

---

## 3. Recommended Stack

### Frontend

- `Next.js` for customer dashboard
- `Next.js` for admin dashboard
- shared component library for common UI primitives
- `Socket.IO client` for realtime status and counters

### Backend

- `NestJS` as the control-plane API
- `Socket.IO gateway` inside NestJS for realtime events
- `BullMQ` for job queues
- `Redis` for queues, rate-limits, caching, and pub/sub
- `PostgreSQL` for primary relational storage
- `S3-compatible object storage` for media and exports

### WhatsApp Runtime

- `Node.js`
- `whatsapp-web.js`
- `Chromium` or `Chrome` in isolated worker containers

### Infrastructure

- Docker for local development
- Kubernetes for production deployment
- NGINX or cloud load balancer at the edge
- Prometheus + Grafana for metrics
- OpenTelemetry for tracing
- Loki or ELK for logs

---

## 4. Top-Level System Layout

```text
Customer Web (Next.js)            Admin Web (Next.js)
            |                                |
            +------------ HTTPS -------------+
                           |
                    API Gateway / Control Plane
                           |
      +--------------------+--------------------+
      |                    |                    |
  PostgreSQL            Redis/BullMQ        Object Storage
      |                    |                    |
      +--------------------+--------------------+
                           |
                 Worker Orchestrator Service
                           |
        +------------------+------------------+
        |                  |                  |
   Instance Worker A  Instance Worker B  Instance Worker N
        |                  |                  |
   WhatsApp Web       WhatsApp Web       WhatsApp Web
   browser session    browser session    browser session
```

---

## 5. Application Modules

## 5.1 Customer Dashboard

Purpose: the customer-facing portal for managing accounts, instances, API usage, webhooks, and message history.

Main modules:

- Authentication screens
- Account profile
- Subscription and invoices
- Instance list
- Instance detail
- QR authorization view
- Instance status monitor
- Message logs
- Webhook settings
- API documentation helper
- Media utility tools
- API token management

Core pages:

- Dashboard overview
- Instances
- Instance manage page
- Messages
- Webhooks
- Subscription
- Settings
- Audit/activity feed

Realtime widgets:

- instance connection state
- QR availability
- queue size
- send limit usage
- inbound/outbound counters
- webhook failure alerts

## 5.2 Admin Dashboard

Purpose: internal operations surface for support, infrastructure control, platform health, and abuse management.

Main modules:

- Admin authentication and RBAC
- Global metrics overview
- User management
- Account management
- Instance explorer
- Worker health monitor
- Message search across tenants
- Webhook delivery inspector
- Subscription management
- Abuse/risk review
- Support actions
- Audit log explorer

Privileged actions:

- suspend user
- disable instance
- restart worker
- rotate instance token
- clear instance session
- view worker screenshot
- replay webhook
- grant trial extension
- mark account for manual review

## 5.3 Control Plane API

Purpose: the single authoritative backend for business rules, persistence, orchestration, audit logging, and external APIs.

This should be implemented as a modular NestJS application.

Main domain modules:

- `AuthModule`
- `UsersModule`
- `AccountsModule`
- `RolesModule`
- `InstancesModule`
- `InstanceSettingsModule`
- `InstanceTokensModule`
- `InstanceLifecycleModule`
- `MessagesModule`
- `WebhooksModule`
- `MediaModule`
- `ChatsModule`
- `ContactsModule`
- `GroupsModule`
- `BillingModule`
- `AdminModule`
- `SupportModule`
- `AuditLogsModule`
- `RealtimeModule`
- `WorkerOrchestrationModule`
- `HealthModule`

## 5.4 Worker Runtime

Purpose: host the real WhatsApp Web sessions and execute all browser-backed actions.

Each worker is responsible for one instance at a time.

Worker modules:

- Browser launcher
- Persistent session store
- QR manager
- State detector
- Send engine
- Receive event adapter
- Screenshot service
- Conflict detector
- Takeover handler
- Retry and reconnect logic
- Worker heartbeat publisher

## 5.5 Queue and Event Layer

Purpose: handle delayed, retryable, and cross-service operations.

Queue groups:

- instance lifecycle jobs
- outbound message jobs
- webhook delivery jobs
- media processing jobs
- billing jobs
- cleanup jobs
- support/admin operation jobs
- analytics aggregation jobs

---

## 6. Detailed Backend Module Breakdown

## 6.1 Auth Module

Responsibilities:

- customer login
- admin login
- password reset
- refresh/access token flow
- MFA support for admin users
- session revocation
- API authentication middleware

Interfaces:

- HTTP endpoints for login/logout/reset
- auth guards for customer and admin areas
- token issuance for dashboard sessions

## 6.2 Users Module

Responsibilities:

- user profile management
- user preferences
- locale and timezone settings
- user state changes

Entities:

- user
- user_profile
- user_preferences

## 6.3 Accounts Module

Responsibilities:

- tenant/account creation
- account ownership
- plan association
- trial state
- account suspension

Entities:

- account
- account_member
- account_status

## 6.4 Roles Module

Responsibilities:

- RBAC policy definitions
- account role mapping
- admin role mapping
- permission checks

Example roles:

- customer owner
- customer admin
- customer operator
- support admin
- infra admin
- super admin

## 6.5 Instances Module

Responsibilities:

- create instance
- delete instance
- list instances
- retrieve instance details
- assign plan and limits
- store display metadata

Entities:

- instance
- instance_metadata

Key fields:

- instance id
- account id
- current status
- public API base URL
- assigned worker id
- expiry date
- trial flag
- auto renewal flag

## 6.6 Instance Tokens Module

Responsibilities:

- issue per-instance API token
- rotate token
- revoke token
- validate token for public API access

Entities:

- instance_token
- instance_token_history

Security rules:

- store hashed token material
- display clear token only at creation or rotation time
- log all rotations

## 6.7 Instance Settings Module

Responsibilities:

- send delay
- send delay max
- webhook URL
- webhook retry count
- webhook event toggles
- rate and quota parameters

Entities:

- instance_settings

## 6.8 Instance Lifecycle Module

Responsibilities:

- start worker
- stop worker
- restart worker
- logout session
- clear instance
- troubleshoot workflows
- move instance to standby or conflict state

Supported states:

- `qr`
- `initialize`
- `booting`
- `loading`
- `retrying`
- `authenticated`
- `disconnected`
- `standby`
- `stopped`
- `expired`

Lifecycle events:

- instance created
- worker assigned
- browser started
- QR ready
- QR expired
- authenticated
- disconnected
- conflict detected
- worker restarted
- session cleared
- token rotated

## 6.9 Worker Orchestration Module

Responsibilities:

- assign a worker container to an instance
- recover crashed workers
- rebalance workers
- detect unhealthy sessions
- manage heartbeat timeouts

Key outputs:

- worker assignment records
- health status
- orchestrator actions

## 6.10 Messages Module

Responsibilities:

- public send endpoints
- outbound message persistence
- inbound message persistence
- status updates
- ACK updates
- message search and filtering
- resend by status
- resend by id
- clear by status

Entities:

- outbound_message
- inbound_message
- message_event
- message_status_snapshot

Supported statuses:

- queue
- sent
- unsent
- invalid
- expired

Supported ACK values:

- pending
- server
- device
- read
- played

## 6.11 Chats Module

Responsibilities:

- store chat identifiers
- sync recent chat state
- expose chat list to dashboard
- archive/read/delete markers

Entities:

- chat
- chat_state

## 6.12 Contacts Module

Responsibilities:

- contact listing
- existence checks
- caching of check results
- block/unblock metadata

Entities:

- contact
- contact_check_cache

## 6.13 Groups Module

Responsibilities:

- group listing
- group metadata caching
- participant snapshots

Entities:

- group
- group_member

## 6.14 Media Module

Responsibilities:

- upload media
- receive media references from workers
- store object keys
- generate signed URLs
- delete media by policy

Entities:

- media_asset
- media_reference

## 6.15 Webhooks Module

Responsibilities:

- build outbound webhook payloads
- enqueue delivery attempts
- retry non-200 responses
- sign payloads
- replay deliveries
- expose delivery logs

Entities:

- webhook_endpoint
- webhook_delivery
- webhook_attempt

## 6.16 Billing Module

Responsibilities:

- plans
- trials
- subscriptions
- invoices
- renewals
- grace periods
- instance expiry enforcement

Entities:

- plan
- subscription
- invoice
- payment
- renewal_event

## 6.17 Audit Logs Module

Responsibilities:

- record customer actions
- record admin actions
- record automated system actions
- provide searchable evidence trails

Entities:

- audit_log

## 6.18 Realtime Module

Responsibilities:

- authenticated websocket sessions
- room subscriptions by account and by instance
- push instance state changes
- push live counters
- push worker health and queue stats

Realtime channels:

- account room
- instance room
- admin global room
- admin worker room

## 6.19 Support Module

Responsibilities:

- support notes
- safe impersonation
- troubleshooting commands
- case history

Entities:

- support_case
- support_note

## 6.20 Admin Module

Responsibilities:

- admin dashboards
- global search
- emergency actions
- risk flags
- platform configuration

---

## 7. Worker Module Breakdown

Each instance worker should be a separate long-lived process with isolated browser storage.

## 7.1 Browser Session Manager

Responsibilities:

- launch Chromium
- maintain user data directory
- restore session on restart
- terminate safely

## 7.2 QR Manager

Responsibilities:

- detect QR generation
- cache active QR image
- emit QR updates
- expire QR after validity window

## 7.3 State Detector

Responsibilities:

- detect connected/authenticated state
- detect loading state
- detect retrying state
- detect standby state
- detect conflict state

## 7.4 Send Engine

Responsibilities:

- process outbound jobs
- honor priority ordering
- honor configured delays
- classify success/failure states
- emit send results

## 7.5 Receive Event Adapter

Responsibilities:

- normalize inbound messages
- normalize ACK events
- normalize reaction events
- normalize media events
- push events to API

## 7.6 Screenshot Service

Responsibilities:

- capture current browser window
- return base64 or temporary stored image
- restrict access to authorized API calls

## 7.7 Conflict and Takeover Handler

Responsibilities:

- detect another active browser/device session
- expose takeover flow
- emit conflict state

## 7.8 Worker Heartbeat

Responsibilities:

- periodic health ping
- current browser memory stats
- active page state
- last successful action timestamp

---

## 8. Public API Surface

The public API should preserve UltraMsg-like ergonomics.

## 8.1 Account-Level API

Purpose:

- list instances
- create instance
- update instance metadata

Example routes:

- `GET /api/account/instances`
- `POST /api/account/instances`
- `PATCH /api/account/instances/:id`

Compatibility facade:

- `GET /api/list`
- `POST /api/create`
- `POST /api/update`

## 8.2 Per-Instance API

Example route groups:

- `/instance/:instanceId/messages/chat`
- `/instance/:instanceId/messages/image`
- `/instance/:instanceId/messages/document`
- `/instance/:instanceId/messages/sticker`
- `/instance/:instanceId/messages/audio`
- `/instance/:instanceId/messages/video`
- `/instance/:instanceId/messages/voice`
- `/instance/:instanceId/messages/contact`
- `/instance/:instanceId/messages/location`
- `/instance/:instanceId/messages/reaction`
- `/instance/:instanceId/messages`
- `/instance/:instanceId/messages/statistics`
- `/instance/:instanceId/messages/resendById`
- `/instance/:instanceId/messages/resendByStatus`
- `/instance/:instanceId/messages/clear`
- `/instance/:instanceId/instance/status`
- `/instance/:instanceId/instance/settings`
- `/instance/:instanceId/instance/restart`
- `/instance/:instanceId/instance/logout`
- `/instance/:instanceId/instance/clear`
- `/instance/:instanceId/instance/screenshot`
- `/instance/:instanceId/instance/qr`
- `/instance/:instanceId/instance/qrCode`
- `/instance/:instanceId/chats`
- `/instance/:instanceId/contacts`
- `/instance/:instanceId/groups`
- `/instance/:instanceId/media/upload`

Authentication model:

- all per-instance routes require instance token
- dashboard requests to these routes should still pass through API policies where needed

---

## 9. Realtime Event Model

The API should aggregate worker events and publish normalized websocket updates.

Core event types:

- `instance.status.changed`
- `instance.qr.updated`
- `instance.settings.updated`
- `instance.messages.statistics.updated`
- `instance.limits.updated`
- `instance.me.updated`
- `message.outbound.created`
- `message.outbound.updated`
- `message.inbound.created`
- `webhook.delivery.updated`
- `worker.health.updated`

Design rules:

- workers publish internal events to Redis pub/sub
- API subscribes and rebroadcasts authorized events to dashboards
- clients never connect directly to workers

---

## 10. Queue Architecture

BullMQ queue set:

- `instance-lifecycle`
- `instance-recovery`
- `outbound-send`
- `message-resend`
- `webhook-delivery`
- `media-processing`
- `billing-renewal`
- `cleanup-retention`
- `admin-operations`

Key job patterns:

- delayed jobs for `sendDelay` and `sendDelayMax`
- retry with backoff for webhooks
- unique job keys for idempotency
- dead-letter handling for exhausted retries

Priority strategy:

- lower numeric priority sends first
- emergency admin jobs must not share a queue with normal sends

---

## 11. Data Model Summary

Minimum database tables:

- `users`
- `user_profiles`
- `accounts`
- `account_members`
- `roles`
- `permissions`
- `account_member_roles`
- `admin_users`
- `instances`
- `instance_tokens`
- `instance_settings`
- `instance_workers`
- `instance_sessions`
- `outbound_messages`
- `inbound_messages`
- `message_events`
- `message_status_snapshots`
- `contacts`
- `contact_check_cache`
- `chats`
- `chat_states`
- `groups`
- `group_members`
- `media_assets`
- `webhook_endpoints`
- `webhook_deliveries`
- `webhook_attempts`
- `plans`
- `subscriptions`
- `invoices`
- `payments`
- `audit_logs`
- `support_cases`
- `support_notes`

Design rules:

- use UUIDs internally where possible
- keep public instance IDs human-compatible if UltraMsg-style parity matters
- separate current snapshot tables from append-only event tables
- index by `instance_id`, `account_id`, `status`, `created_at`, and `reference_id`

---

## 12. Customer Dashboard Module Map

## 12.1 Overview Module

Displays:

- active instance count
- pending/expired instance count
- daily send usage
- webhook failures
- recent inbound and outbound activity

## 12.2 Instances Module

Displays:

- all instances
- filter by status
- expiry date
- auto renewal state
- manage action

Actions:

- create instance
- rename instance
- rotate token
- open manage page
- pay or renew

## 12.3 Instance Manage Module

Displays:

- status badge
- API base URL
- token
- worker health
- QR section
- queue statistics
- limits section

Actions:

- restart
- logout
- clear
- send test message
- edit webhook settings
- edit send delays
- screenshot view
- troubleshoot

## 12.4 Messages Module

Displays:

- message list
- filters by status, ack, id, referenceId, from, to
- message timing
- resend availability

## 12.5 Settings and Billing Module

Displays:

- profile settings
- password reset
- invoices
- plan details
- account API token

---

## 13. Admin Dashboard Module Map

## 13.1 Global Overview

Displays:

- total active instances
- authenticated instances
- disconnected instances
- workers online
- queue backlog
- webhook failure rate
- account growth

## 13.2 Users and Accounts

Displays:

- account search
- plan state
- trial state
- suspension state
- recent support interactions

Actions:

- suspend
- unsuspend
- extend trial
- reset account API token

## 13.3 Instance Explorer

Displays:

- instance detail across all tenants
- assigned worker
- session state
- current browser health
- recent errors

Actions:

- restart worker
- logout session
- clear session
- rotate token
- force reassign worker
- capture screenshot

## 13.4 Worker Health

Displays:

- worker node
- CPU and memory
- browser process count
- crash loops
- heartbeat age

## 13.5 Global Messages

Displays:

- cross-tenant search
- delivery states
- ACK progression
- queue aging

## 13.6 Webhook Inspector

Displays:

- endpoint URL
- event type
- response code
- retries
- payload preview

Actions:

- replay delivery
- disable endpoint

## 13.7 Risk and Abuse

Displays:

- spike detection
- repeated invalid targets
- excessive contact checks
- blocked account patterns

Actions:

- rate-limit account
- require manual review
- disable instance creation

---

## 14. Security Architecture

Mandatory controls:

- hash stored tokens
- encrypt browser session artifacts at rest
- segregate customer and admin auth domains
- require MFA for admins
- record every admin action in audit logs
- sign webhook payloads
- rate-limit public APIs
- isolate workers by container or pod
- never expose worker network directly to browsers

Sensitive data handling:

- redact tokens from logs
- redact message bodies in admin views unless explicitly authorized
- expire temporary screenshots
- use short-lived signed URLs for media access

---

## 15. Observability

Metrics:

- active workers
- worker crash count
- authenticated instance count
- queue depth by type
- average send latency
- webhook success rate
- screenshot failures
- QR generation rate

Logs:

- request logs
- worker lifecycle logs
- browser crash logs
- webhook delivery logs
- admin action logs

Tracing:

- API request to queue job
- queue job to worker execution
- worker event to webhook delivery

---

## 16. Deployment Topology

Production layout:

- `customer-web` deployment
- `admin-web` deployment
- `api` deployment
- `queue-worker` deployment for BullMQ processors
- `worker-orchestrator` deployment
- `session-worker` stateful or isolated workload pool
- PostgreSQL cluster
- Redis cluster
- object storage bucket

Scaling rules:

- web and API scale horizontally
- queue processors scale by queue pressure
- session workers scale by instance count
- keep one active worker assignment per instance

---

## 17. Implementation Phases

## Phase 1: Core Parity

- auth
- account management
- instance create/list/manage
- QR authorization
- realtime status
- send text
- message logs
- webhook settings
- restart/logout/clear

## Phase 2: Operational Parity

- media sends
- resend flows
- screenshot endpoint
- conflict/takeover
- chats/contacts/groups
- admin dashboard
- worker health views

## Phase 3: Production Hardening

- horizontal scaling
- advanced rate controls
- abuse detection
- full observability
- billing automation
- retention cleanup

---

## 18. Final Recommendation

Elite Message should be built as a platform with:

- two separate dashboards
- one control-plane API
- one orchestration layer
- many isolated browser-backed instance workers
- queue-driven asynchronous processing
- strong audit and admin tooling

The system should not try to make the API server host live WhatsApp sessions directly. That coupling would make recovery, scaling, and support operations significantly harder.

The clean architecture is:

- `Next.js` for customer dashboard
- `Next.js` for admin dashboard
- `NestJS` for control plane
- `Redis + BullMQ` for async operations
- `PostgreSQL` for durable data
- `whatsapp-web.js + Chromium workers` for session execution
- `S3-compatible storage` for media and exports

This structure gives the closest path to a real UltraMsg-equivalent system with room for production growth.
