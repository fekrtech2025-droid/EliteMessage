# Elite Message Documentation Set

Status date: 2026-04-12

This documentation set describes the current repository state of Elite Message and complements the older architecture and phase-planning documents already present in `docs/`. It is intended to be a standard project documentation baseline for business, requirements, architecture, API, data, and UI/UX work.

## Unified PDF Deliverables

- [English PDF](/Volumes/MACOS/EliteMessage/docs/current-status/output/Elite-Message-Current-Status-EN.pdf)
- [Arabic PDF](/Volumes/MACOS/EliteMessage/docs/current-status/output/Elite-Message-Current-Status-AR.pdf)

## Browsable Page Deliverables

- [Pages index](/Volumes/MACOS/EliteMessage/docs/current-status/pages/index.html)
- [English page hub](/Volumes/MACOS/EliteMessage/docs/current-status/pages/en/index.html)
- [Arabic page hub](/Volumes/MACOS/EliteMessage/docs/current-status/pages/ar/index.html)

To regenerate the PDFs from the repository root:

```bash
pnpm docs:pdf
```

To regenerate the page-format HTML set from the repository root:

```bash
pnpm docs:pages
```

## Current Project Summary

Elite Message is a multi-application messaging platform for managing WhatsApp-linked sending instances. It currently includes:

- a customer web application for signup, signin, workspace operations, instance management, messaging exploration, subscription/settings, and API usage documentation
- an admin web application for users, workspaces, workers, support, audit, messages, and instance operations
- a NestJS API that serves authentication, dashboard, admin, customer, public instance, internal, and webhook-oriented endpoints
- a worker process that handles instance runtime, queue-backed operational work, heartbeats, and WhatsApp session handling
- PostgreSQL, Redis, MinIO, Prometheus, Alertmanager, and Grafana for local infrastructure and operational support

## Technology Baseline

| Area               | Current choice                       |
| ------------------ | ------------------------------------ |
| Monorepo           | `pnpm` + `Turborepo`                 |
| Language           | TypeScript                           |
| Customer/Admin web | Next.js 16 + React 19                |
| API                | NestJS 11 on Express 5               |
| Realtime           | Socket.IO                            |
| Worker             | Node.js + BullMQ + `whatsapp-web.js` |
| Database           | PostgreSQL                           |
| ORM                | Prisma 7                             |
| Queue / broker     | Redis                                |
| Object storage     | MinIO / S3-compatible storage        |
| Validation         | Zod                                  |
| Testing            | Vitest, Testing Library, Supertest   |
| Observability      | Prometheus, Grafana, Alertmanager    |

## Current Delivery Status

| Area                    | Status      | Notes                                                                                            |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| Customer authentication | Implemented | Email/password and Google OAuth support are present.                                             |
| Admin authentication    | Implemented | Admin login and MFA support are present in the codebase.                                         |
| Workspace model         | Implemented | Workspaces, memberships, tokens, and trial metadata are modeled.                                 |
| Instance lifecycle      | Implemented | Create, operate, inspect, QR/auth state, and runtime tracking are present.                       |
| Messaging               | Implemented | Outbound, inbound, webhook delivery, and customer/admin explorers exist.                         |
| API access              | Implemented | Account and instance tokens, API docs page, and usage snippets are present.                      |
| Operational telemetry   | Partial     | Metrics and local observability configs exist; production hardening remains ongoing.             |
| Security hardening      | Partial     | Rate limiting, signed webhooks, and admin MFA exist; full production controls remain incomplete. |
| Product documentation   | Partial     | Existing docs are mostly target-state; this set fills the current-state gap.                     |

## Documentation Map

### 1. Business and planning

- [Project Overview](/Volumes/MACOS/EliteMessage/docs/current-status/business/project-overview.md)
- [Software Proposal](/Volumes/MACOS/EliteMessage/docs/current-status/business/software-proposal.md)
- [Scope Document](/Volumes/MACOS/EliteMessage/docs/current-status/business/scope-document.md)
- [Feasibility Study](/Volumes/MACOS/EliteMessage/docs/current-status/business/feasibility-study.md)
- [Budget and Timeline](/Volumes/MACOS/EliteMessage/docs/current-status/business/budget-and-timeline.md)
- [Stakeholder List](/Volumes/MACOS/EliteMessage/docs/current-status/business/stakeholder-list.md)
- [Risk Register](/Volumes/MACOS/EliteMessage/docs/current-status/business/risk-register.md)

### 2. Requirements

- [Business Requirements Document (BRD)](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/business-requirements-document.md)
- [Software Requirements Specification (SRS)](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/software-requirements-specification.md)
- [Functional Requirements](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/functional-requirements.md)
- [Non-Functional Requirements](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/non-functional-requirements.md)
- [Use Cases](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/use-cases.md)
- [User Stories](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/user-stories.md)
- [Acceptance Criteria](/Volumes/MACOS/EliteMessage/docs/current-status/requirements/acceptance-criteria.md)

### 3. Product and design

- [System Architecture Document](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/system-architecture-document.md)
- [High-Level Design (HLD)](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/high-level-design.md)
- [Low-Level Design (LLD)](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/low-level-design.md)
- [Database Schema Documentation](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/database-schema-documentation.md)
- [API Design and Specification](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/api-design-specification.md)
- [UI/UX Documentation](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/ui-ux-documentation.md)
- [Wireframes and Mockups](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/wireframes-and-mockups.md)
- [Flowcharts and Sequence Diagrams](/Volumes/MACOS/EliteMessage/docs/current-status/product-design/flowcharts-and-sequence-diagrams.md)

## Existing Reference Documents

These pre-existing documents remain useful as supporting references:

- [Existing architecture reference](/Volumes/MACOS/EliteMessage/docs/elite-message-full-module-architecture.md)
- [Existing API route list](/Volumes/MACOS/EliteMessage/docs/elite-message-api-route-list.md)
- [Existing database schema reference](/Volumes/MACOS/EliteMessage/docs/elite-message-database-schema.md)
- [Existing MVP phase plan](/Volumes/MACOS/EliteMessage/docs/elite-message-mvp-phase-plan.md)

## Documentation Notes

- This set is based on the checked-in repository structure, package manifests, Prisma schema, route inventory, and current customer/admin UI surfaces.
- Where commercial or organizational data is not stored in the repository, planning values are marked as inferred or estimated rather than recorded fact.
- Where implementation is partial, the documents call that out explicitly instead of presenting the target state as complete.
