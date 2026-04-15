# Stakeholder List

Status date: 2026-04-12

## Important Note

The repository does not store a formal stakeholder register. The list below is a standard current-state stakeholder model inferred from the implemented product surfaces and platform responsibilities.

## Stakeholder Register

| Stakeholder                    | Role in project                | Main interests                                          |
| ------------------------------ | ------------------------------ | ------------------------------------------------------- |
| Product owner / sponsor        | Business direction and funding | Scope, timeline, value delivery, release decisions      |
| Customer workspace owner       | Primary external operator      | Instance setup, token access, messaging, visibility     |
| Customer operator / admin      | Day-to-day workspace user      | Runtime status, messages, settings, API usage           |
| Platform administrator         | Internal operational owner     | User/workspace governance, interventions, oversight     |
| Support / operations team      | Issue triage and recovery      | Support cases, auditability, operational tooling        |
| Backend/platform engineering   | Core system delivery           | API correctness, worker orchestration, data integrity   |
| Frontend engineering           | Customer/admin UX delivery     | Usability, clarity, route architecture, feedback states |
| QA / validation                | Product quality                | Regression coverage, manual flows, acceptance readiness |
| DevOps / SRE                   | Runtime reliability            | Infra, metrics, alerting, deployment posture            |
| Security / compliance reviewer | Risk control                   | Sessions, tokens, MFA, retention, auditability          |

## Stakeholder Priorities

- customers need predictable self-service and clear API onboarding
- admins need reliable operational visibility and intervention tools
- engineering needs shared contracts, stable data models, and documented boundaries
- operations needs observability and support playbooks
