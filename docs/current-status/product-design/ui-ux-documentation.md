# UI/UX Documentation

Status date: 2026-04-12

## Product Surfaces

### Customer surface

Current major pages:

- signin
- signup
- dashboard
- messages
- settings
- subscription
- API documents
- instance detail

### Admin surface

Current major pages:

- admin signin
- dashboard
- messages
- users
- workspaces
- workers
- worker detail
- support
- audit
- instance detail

## Current UX Direction

- light-theme-first
- role-separated customer/admin experiences
- persistent sidebar + topbar shell for authenticated routes
- scan-first explorer pages
- high-contrast operational status and action framing

## Shared UI Characteristics

- shared `@elite-message/ui` package
- common shell, cards, badges, banners, and auth primitives
- modern auth flows with inline validation and contextual help
- progress feedback during page navigation

## Customer UX Priorities

- quick path from authentication to instance setup
- visible instance runtime and API access
- clear distinction between workspace-level and instance-level tokens
- strong API onboarding experience for backend developers

## Admin UX Priorities

- dense but readable operational explorers
- reliable filtering and traceability
- clear privileged-action framing
- strong session and MFA states

## Current UX Gaps

- documentation and visual system alignment still needs ongoing maintenance
- some operational states still need more refinement for production polish
- current wireframes/mockups are mostly implemented in code rather than maintained in a separate design file
