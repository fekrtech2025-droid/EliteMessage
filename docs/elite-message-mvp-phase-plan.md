# Elite Message

## MVP Phase Plan

Version: 1.0  
Prepared for: Elite Message project  
Document type: implementation phase plan  
Target: UltraMsg-equivalent MVP with customer dashboard, admin dashboard, worker runtime, public API, and core operations

---

## 1. Goal

This document defines a realistic MVP phase plan for Elite Message.

The objective is not to build every feature UltraMsg has on day one. The objective is to deliver a production-credible first version that can:

- create and manage WhatsApp instances
- authorize instances with QR
- send and receive messages
- expose a developer API
- provide a usable customer dashboard
- provide a basic admin dashboard
- handle queueing, webhooks, and worker recovery

The MVP should be built in phases so the platform becomes testable early and hardening work starts before feature expansion gets too wide.

---

## 2. MVP Definition

Elite Message MVP is considered complete when all of the following are true:

- a customer can register and log in
- a customer can create at least one instance
- the instance can reach QR state and be authenticated
- the instance can send text messages from API and dashboard
- the instance can receive inbound messages and deliver them to webhook
- the customer dashboard shows live status and message logs
- an admin can inspect users, instances, workers, and webhook failures
- queueing and resend flows work for core cases
- logging, audit, and basic monitoring exist

The MVP does not need full feature parity with UltraMsg.

---

## 3. Product Scope for MVP

## 3.1 In Scope

- customer authentication
- account and subscription skeleton
- instance creation and management
- QR authorization
- instance state transitions
- worker orchestration
- send text message
- basic media upload
- outbound message logs
- inbound message capture
- webhook delivery with retries
- basic contact check
- customer dashboard
- admin dashboard
- token rotation
- restart, logout, clear actions
- audit logs
- queue-based async processing

## 3.2 Explicitly Out of Scope for MVP

- advanced chatbot builder
- large analytics suite
- multi-language UI completeness
- full invoice/payment gateway automation
- advanced abuse engine
- enterprise team workflows
- complex bulk campaign tooling
- white-label support
- deep group management features

---

## 4. Delivery Model

Recommended delivery sequence:

1. Foundation and architecture baseline
2. Core customer-facing messaging flow
3. Worker stability and webhook reliability
4. Admin operations and support tooling
5. Production hardening and launch readiness

Why this order:

- you need a real instance lifecycle before anything else matters
- sending and receiving messages is the core proof of value
- admin tooling is necessary before inviting real users
- production hardening must happen before scale, not after failures

---

## 5. Team Recommendation

Ideal MVP team:

- 1 product/technical lead
- 2 backend engineers
- 1 frontend engineer
- 1 worker/runtime engineer
- 1 DevOps/platform engineer part-time or shared
- 1 QA engineer part-time or shared

Lean team alternative:

- 1 senior full-stack lead
- 1 backend engineer
- 1 frontend engineer
- 1 DevOps/runtime engineer part-time

---

## 6. Proposed Timeline

Recommended MVP timeline:

- Phase 0: 1 week
- Phase 1: 2 weeks
- Phase 2: 3 weeks
- Phase 3: 2 weeks
- Phase 4: 2 weeks
- Phase 5: 2 weeks

Total recommended first MVP delivery window:

- 10 to 12 weeks

Compressed timeline risk:

- below 8 weeks will likely push reliability problems into post-launch

---

## 7. Phase 0: Foundation

Duration:

- 1 week

Goal:

- establish the monorepo, architecture boundaries, environment setup, and non-negotiable engineering standards

Deliverables:

- monorepo with `apps/web`, `apps/admin-web`, `apps/api`, `apps/worker`, `packages/contracts`, `packages/sdk`, `packages/ui`
- local Docker setup
- PostgreSQL, Redis, object storage local config
- base NestJS application
- base Next.js applications
- worker application skeleton
- CI pipeline
- linting, formatting, type-check, test baseline
- environment variable strategy
- migration framework
- seed scripts

Key technical tasks:

- repository structure
- shared TypeScript config
- API conventions
- DTO and schema strategy
- auth strategy selection
- queue naming conventions
- event naming conventions
- logging format

Acceptance criteria:

- all apps boot locally
- database migrations run from clean state
- Redis and queue connectivity work
- CI passes on a clean branch
- base health endpoints are available

Exit artifact:

- development environment stable enough for feature work

Major risks:

- unclear module boundaries
- weak local environment reproducibility

---

## 8. Phase 1: Identity, Accounts, and Instance Skeleton

Duration:

- 2 weeks

Goal:

- make the platform usable at the account level and create the first instance records and admin visibility

Deliverables:

- customer auth
- admin auth
- account creation
- account membership basics
- plans and subscription skeleton
- instance CRUD in API
- account API tokens
- per-instance API tokens
- customer dashboard shell
- admin dashboard shell
- audit log base

Customer-facing features:

- sign up
- sign in
- profile
- dashboard overview placeholder
- create instance
- list instances
- rotate token

Admin-facing features:

- login
- list users
- list accounts
- list instances
- inspect account and instance detail

Backend modules finished in this phase:

- AuthModule
- UsersModule
- AccountsModule
- RolesModule
- InstancesModule
- InstanceTokensModule
- AuditLogsModule

Acceptance criteria:

- a customer can create an account
- a customer can create an instance record
- an admin can find that instance in the admin panel
- account token and instance token generation both work
- audit logs record creation and rotation actions

Exit artifact:

- a functioning control plane with no live WhatsApp session yet

Major risks:

- overbuilding billing too early
- mixing customer and admin permissions incorrectly

---

## 9. Phase 2: Worker Runtime and QR Authorization

Duration:

- 3 weeks

Goal:

- make instances real by connecting them to browser-backed workers and exposing live runtime status

Deliverables:

- worker registration
- worker assignment service
- Chromium session bootstrap
- WhatsApp Web session handling
- QR generation
- runtime state detection
- instance status API
- realtime Socket.IO status updates
- screenshot endpoint
- restart, logout, clear actions
- conflict/takeover handling

Runtime states to support:

- `initialize`
- `booting`
- `loading`
- `qr`
- `authenticated`
- `retrying`
- `disconnected`
- `standby`

Customer-facing features:

- instance manage page
- QR view
- live status badge
- screenshot preview
- restart/log out/clear actions

Admin-facing features:

- worker list
- worker detail
- instance-to-worker mapping
- force restart

Backend modules finished in this phase:

- WorkerOrchestrationModule
- InstanceLifecycleModule
- RealtimeModule
- worker browser runtime

Acceptance criteria:

- a customer can scan QR and authenticate an instance
- authenticated status is visible live in dashboard
- logout returns the instance to QR
- clear resets session and settings
- restart recovers the instance runtime
- screenshot endpoint returns a valid image

Exit artifact:

- first end-to-end live session lifecycle working

Major risks:

- browser instability
- session persistence bugs
- conflict state edge cases

---

## 10. Phase 3: Core Messaging Flow

Duration:

- 3 weeks

Goal:

- support the minimum valuable customer workflow: send, log, receive, and webhook

Deliverables:

- outbound text message API
- outbound dashboard test-send flow
- message queue with priority
- send delays
- outbound message log
- inbound message ingestion
- webhook delivery with retry
- message statistics
- resend by id
- resend by status
- clear message logs by status

Customer-facing features:

- send test message widget
- message log page
- filters by status, ack, from, to, referenceId
- webhook settings form
- resend actions

Public API features:

- `/messages/chat`
- `/messages`
- `/messages/statistics`
- `/messages/resendById`
- `/messages/resendByStatus`
- `/messages/clear`
- `/instance/status`
- `/instance/settings`

Backend modules finished in this phase:

- MessagesModule
- WebhooksModule
- queue processors for outbound send and webhook delivery

Acceptance criteria:

- customer can send a text message from API
- dashboard logs reflect queued and sent messages
- inbound messages are captured and stored
- webhook delivery succeeds to a configured endpoint
- failed webhook attempts retry according to policy
- resend flows operate correctly

Exit artifact:

- customer can integrate Elite Message into a real application

Major risks:

- duplicate webhook deliveries
- missing idempotency on message status updates
- queue starvation or ordering bugs

---

## 11. Phase 4: Customer Dashboard MVP Completion

Duration:

- 2 weeks

Goal:

- make the customer dashboard usable enough for real beta customers

Deliverables:

- dashboard overview metrics
- polished instance list and instance detail screens
- settings and profile pages
- account API token screen
- instance token management
- message statistics widgets
- basic media upload
- contact check UI
- invoices and subscription placeholder screens

Customer-facing pages ready:

- login and signup
- overview
- instances list
- instance manage page
- messages
- settings
- subscription overview

UX requirements:

- fast feedback for lifecycle actions
- live status updates without page refresh
- sane empty states
- API examples on instance pages

Acceptance criteria:

- a customer can complete the full flow without touching internal tools
- UI exposes the important API values and status states clearly
- webhook and message settings can be edited from the dashboard
- media upload works for future use in send flows

Exit artifact:

- closed beta-ready customer-facing application

Major risks:

- weak UX around QR expiry and queue behavior
- exposing too much low-level runtime detail to customers

---

## 12. Phase 5: Admin Dashboard MVP Completion

Duration:

- 2 weeks

Goal:

- give internal operators enough visibility and control to support beta customers safely

Deliverables:

- global overview metrics
- user management
- account management
- instance explorer
- worker explorer
- global message search
- webhook delivery inspector
- support case skeleton
- audit log explorer

Admin actions required:

- suspend account
- unsuspend account
- extend trial
- restart instance
- log out instance
- clear instance
- reassign worker
- replay webhook
- view screenshot

Acceptance criteria:

- support/admin team can diagnose the common failure cases
- worker failures and webhook failures are visible
- there is a safe path to help a customer recover an instance
- every admin action is auditable

Exit artifact:

- internal operations MVP complete

Major risks:

- missing filters in admin tools
- too much power without RBAC and audit enforcement

---

## 13. Phase 6: Hardening and Launch Readiness

Duration:

- 2 weeks

Goal:

- reduce launch risk before onboarding real paying customers

Deliverables:

- structured logs across all services
- Prometheus metrics and Grafana dashboards
- alerting for worker heartbeat loss
- alerting for webhook failure rate
- retry/backoff review
- load test for core send path
- security review
- backup and restore validation
- retention jobs
- token redaction review
- deployment playbooks
- incident checklist

Hardening checklist:

- queue dead-letter handling
- browser crash recovery
- idempotent event ingestion
- signed webhooks
- admin MFA
- audit log coverage
- rate limits on public API
- basic abuse heuristics

Acceptance criteria:

- the system survives worker restarts without data loss
- key metrics and alerts are visible
- deployment rollback is documented
- security review findings are addressed or explicitly accepted

Exit artifact:

- beta launch candidate

Major risks:

- weak observability
- launch without operational alarms

---

## 14. Recommended Milestone Gates

Use explicit go/no-go gates between phases.

### Gate A: After Phase 1

Questions:

- can we create and manage accounts and instances cleanly
- are auth and RBAC stable enough to continue

Decision:

- do not start worker runtime work if control plane basics are unstable

### Gate B: After Phase 2

Questions:

- can we authenticate instances reliably
- do runtime states look trustworthy

Decision:

- do not begin messaging volume tests until QR/session flow is stable

### Gate C: After Phase 3

Questions:

- can we actually send and receive messages correctly
- do webhooks work with retries and logs

Decision:

- this is the real MVP core gate

### Gate D: After Phase 5

Questions:

- can the support/admin team operate the system safely
- do we have enough visibility to run beta customers

Decision:

- no beta launch without this gate passing

---

## 15. Recommended Sprint Breakdown

Example 12-week breakdown:

- Week 1: foundation
- Week 2: auth and accounts
- Week 3: instances and tokens
- Week 4: worker bootstrap
- Week 5: QR and status flow
- Week 6: runtime actions and screenshots
- Week 7: outbound messaging
- Week 8: inbound and webhooks
- Week 9: customer dashboard completion
- Week 10: admin dashboard completion
- Week 11: hardening and load testing
- Week 12: bug fix, beta readiness, controlled rollout

---

## 16. Dependency Map

Dependencies by phase:

### Phase 0 depends on

- architecture sign-off
- tech stack sign-off
- repository access

### Phase 1 depends on

- Phase 0 complete
- database schema approved

### Phase 2 depends on

- instance data model stable
- runtime storage strategy decided
- worker infrastructure available

### Phase 3 depends on

- Phase 2 working session lifecycle
- queue framework stable

### Phase 4 depends on

- Phase 3 public APIs stable enough for UI binding

### Phase 5 depends on

- reliable worker and message data already visible in API

### Phase 6 depends on

- end-to-end feature set usable

---

## 17. Testing Strategy by Phase

## Phase 0

- smoke tests
- migration tests
- CI verification

## Phase 1

- auth integration tests
- RBAC tests
- token generation tests

## Phase 2

- worker assignment tests
- QR lifecycle tests
- instance state transition tests
- browser session restore tests

## Phase 3

- message send integration tests
- queue ordering tests
- webhook retry tests
- duplicate event protection tests

## Phase 4

- end-to-end customer flows
- UI regression tests for critical screens

## Phase 5

- admin permission tests
- audit logging tests
- support recovery flow tests

## Phase 6

- load testing
- failure injection
- restart recovery drills

---

## 18. MVP Success Metrics

Suggested operational KPIs for MVP:

- instance authentication success rate
- outbound send success rate
- webhook delivery success rate
- worker crash recovery time
- average time from instance creation to first authenticated state
- average time from message request to sent state
- support time to resolve common instance issues

Suggested product KPIs for beta:

- percentage of beta users who create at least one instance
- percentage of beta users who send at least one successful message
- percentage of beta users who configure a webhook

---

## 19. Launch Sequence Recommendation

Recommended launch stages:

### Stage 1: Internal alpha

- team members only
- 3 to 5 test instances
- aggressive logging

### Stage 2: Friendly beta

- 5 to 10 trusted external users
- daily operational review
- limited instance count

### Stage 3: Controlled public beta

- capped signups
- support response coverage
- worker capacity monitoring

### Stage 4: Paid onboarding

- only after support flow and billing flow are stable enough

---

## 20. Major MVP Risks

### Technical risks

- browser runtime instability
- session corruption
- queue duplication
- webhook retry storms
- insufficient worker isolation

### Product risks

- copying too much of UltraMsg too early
- spending time on low-value parity features
- weak onboarding UX for QR and token setup

### Operational risks

- no admin tooling for failures
- insufficient metrics
- no incident playbook

### Compliance and platform risks

- WhatsApp account bans
- abuse by bad customers
- token leakage through logs or UI

---

## 21. What Must Not Slip

The following should be treated as non-negotiable for MVP:

- instance lifecycle reliability
- message send correctness
- webhook retries and visibility
- admin ability to inspect and recover broken instances
- audit logs for privileged actions
- token rotation and token redaction

If schedule pressure appears, cut scope from these areas instead:

- advanced billing automation
- richer analytics
- lower-value UI polish
- non-essential utilities

---

## 22. Recommended Post-MVP Backlog

Features for immediately after MVP:

- richer media send support
- chats and contacts sync improvements
- group metadata improvements
- advanced retry policies
- analytics dashboards
- customer team roles
- support impersonation with safeguards
- stronger abuse detection
- payment gateway automation
- export and reporting tools

---

## 23. Final Recommendation

Elite Message MVP should be delivered in six sequential phases:

1. Foundation
2. Identity, accounts, and instance skeleton
3. Worker runtime and QR authorization
4. Core messaging flow
5. Customer dashboard completion
6. Admin dashboard completion and hardening

The real milestone is not when the UI looks complete. The real milestone is when this end-to-end chain is stable:

- create instance
- scan QR
- authenticate
- send message
- receive message
- deliver webhook
- recover from failure through admin tools

That is the correct MVP center of gravity for Elite Message.
