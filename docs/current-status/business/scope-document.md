# Scope Document

Status date: 2026-04-12

## Scope Statement

Elite Message delivers a multi-tenant messaging control platform for customers and administrators, backed by a runtime worker and an operational API surface.

## In Scope

### Customer scope

- signup and signin
- Google OAuth signin/signup
- workspace dashboard
- instance creation and inspection
- QR/auth lifecycle visibility
- instance token visibility and rotation-assisted workflows
- outbound/inbound message exploration
- settings and subscription pages
- API documentation and language examples

### Admin scope

- admin signin and MFA
- users management
- workspaces management
- workers monitoring
- instance detail inspection
- messages explorer
- support case views
- audit views

### Platform scope

- PostgreSQL-backed tenant and runtime data model
- API tokens for account and instance access
- webhook delivery tracking
- rate limiting and retention settings
- internal metrics and local observability configuration

## Out of Scope

- native mobile applications
- dedicated billing gateway implementation
- third-party CRM or ERP connectors beyond API/webhook patterns
- full production SRE runbooks and enterprise compliance pack
- dark mode or multi-brand theming

## Constraints

- the project is currently optimized for local/docker-based development
- some planning and commercial data is not stored in the repository
- parts of operational hardening remain partial even where configuration scaffolding exists

## Assumptions

- PostgreSQL remains the primary system of record
- Redis remains the queue and transient coordination layer
- customer usage centers on instance-oriented sending workflows
- admin users require higher-trust controls than customers

## Current Scope Boundary Assessment

The repository already exceeds simple MVP scaffolding. The practical scope boundary today is not “build the first app”, but “stabilize and harden an already broad platform surface.”
