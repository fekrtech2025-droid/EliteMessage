# API Design and Specification

Status date: 2026-04-12

## API Style

- HTTP/JSON
- versioned routes under `/api/v1`
- separate route families for auth, customer, admin, internal, and public instance/account APIs

## API Consumer Types

- customer web app
- admin web app
- worker/internal services
- external backend integrators

## Authentication Models

### Dashboard session auth

- email/password login
- refresh-backed session model
- Google OAuth for customer accounts when configured
- admin MFA for privileged access

### Token auth

- account-level API tokens
- instance-level API tokens
- bearer usage and query-token patterns where supported by the public API

## Major Route Families

- `/api/v1/auth/*`
- `/api/v1/customer/*`
- `/api/v1/admin/*`
- `/api/v1/internal/*`
- `/api/v1/instance/*`
- `/health`, `/ready`, `/metrics`

## Design Principles

- keep admin and customer concerns separated
- expose instance-scoped public APIs for sending and runtime inspection
- keep internal worker coordination separate from public routes
- preserve room for rate limiting, metrics, and retention controls

## Current Public API Themes

- send chat and media messages
- inspect instance status
- inspect message history
- use account and instance tokens safely
- document payloads with code examples in common backend languages

## Error and Response Design

The exact route-level shapes should be read from the implementation and existing route reference. In general, the design intent is:

- typed JSON payloads
- explicit unauthorized/forbidden handling
- rate-limit capable responses on public and dashboard routes
- machine-readable error bodies for UI and integration use

## Current-State Notes

- API documentation exists in the customer app for practical developer onboarding.
- Admin and customer UIs rely on the same backend but different route families.
- Health and metrics endpoints exist for operational inspection.

## Reference

For the detailed route inventory, see:

- [Existing API route list](/Volumes/MACOS/EliteMessage/docs/elite-message-api-route-list.md)
