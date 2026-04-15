# Budget and Timeline

Status date: 2026-04-12

## Important Note

The repository does not contain an approved commercial budget. The figures below are planning estimates derived from the current project scope and should be treated as a standard budgeting baseline, not as recorded spend.

## Delivery Assumptions

- 1 backend/platform engineer
- 1 frontend engineer
- 0.5 QA engineer
- 0.25 product/design lead
- 0.25 DevOps/SRE support

## Indicative Effort

| Workstream                              | Estimated effort |
| --------------------------------------- | ---------------- |
| Documentation and requirements baseline | 1 to 2 weeks     |
| Customer UX refinement                  | 2 to 4 weeks     |
| Admin UX refinement                     | 2 to 3 weeks     |
| Operational hardening and verification  | 3 to 5 weeks     |
| Release readiness and support processes | 1 to 2 weeks     |

Estimated total: 9 to 16 calendar weeks, depending on how much work is parallelized and how much operational hardening is required for the release target.

## Indicative Budget Model

Using a blended delivery cost of approximately USD 2,500 to USD 5,000 per full-time-equivalent week:

- lower-bound estimate: USD 62,500
- upper-bound estimate: USD 150,000

These numbers are reasonable planning placeholders for taking the current codebase to a better-documented, better-hardened release state.

## Suggested Milestone Plan

| Milestone | Target outcome                                      |
| --------- | --------------------------------------------------- |
| M1        | Current-state documentation baseline approved       |
| M2        | Customer UI/UX stabilization completed              |
| M3        | Admin UI/UX stabilization completed                 |
| M4        | Hardening, metrics, alerts, and validation complete |
| M5        | Release readiness review and go-live decision       |

## Timeline Risk Drivers

- WhatsApp runtime reliability work
- environment and OAuth configuration issues
- backlog growth from UX redesign requests
- production hardening requirements beyond local validation
