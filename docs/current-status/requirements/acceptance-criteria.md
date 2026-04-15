# Acceptance Criteria

Status date: 2026-04-12

## Authentication

- Customer user can sign up and sign in through the customer surface.
- Admin user can sign in through the admin surface.
- Google sign-in redirects correctly when OAuth credentials are configured.
- Invalid credentials produce a visible, actionable error message.

## Workspace and instance setup

- Authenticated customer user can create an instance.
- Instance detail exposes lifecycle and runtime information.
- QR/auth state updates are visible in the UI.
- Public API instance ID is visible after instance creation.

## API usage

- Customer user can access an API documentation page.
- The API docs page shows endpoint examples in common backend languages.
- Copy actions exist for tokens, endpoints, or snippets where exposed.
- The docs clearly distinguish workspace-level tokens from instance-level tokens.

## Messaging visibility

- Customer messages page shows outbound and inbound activity.
- Admin messages page shows global activity and webhook context.
- Delivery status and related metadata are visible for troubleshooting.

## Admin operations

- Admin can open workspaces, users, workers, audit, support, and instance detail routes.
- Admin views present usable filters and scanable result sets.
- Admin authentication supports MFA setup and verification where configured.

## Operational baseline

- Local infra can be started through Docker Compose.
- API health and metrics endpoints are reachable.
- Prometheus, Grafana, and Alertmanager configs exist in the repo.
- The schema supports sessions, tokens, messages, webhook deliveries, audit logs, and support cases.
