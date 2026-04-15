# Risk Register

Status date: 2026-04-12

## Risk Scale

- Probability: Low / Medium / High
- Impact: Low / Medium / High

## Current Risks

| ID  | Risk                                                               | Probability | Impact | Mitigation                                                                                  | Current status |
| --- | ------------------------------------------------------------------ | ----------- | ------ | ------------------------------------------------------------------------------------------- | -------------- |
| R1  | Product docs drift from implementation                             | High        | Medium | Maintain current-state docs in-repo and update with major feature changes                   | Active         |
| R2  | Runtime reliability issues in WhatsApp worker flows                | Medium      | High   | Keep worker heartbeats, lifecycle event logs, and recovery tooling visible                  | Active         |
| R3  | OAuth or auth misconfiguration blocks access                       | Medium      | Medium | Validate env setup, clear error messaging, and test-user instructions                       | Active         |
| R4  | Security controls remain partial for production use                | Medium      | High   | Complete hardening checklist, threat review, and validation plan                            | Active         |
| R5  | UI redesign work expands scope without closure                     | High        | Medium | Sequence UX changes by shell, dashboard, explorer, detail pages                             | Active         |
| R6  | Queue, webhook, or retry behavior becomes hard to operate at scale | Medium      | High   | Keep metrics, delivery explorer, replay support, and retention policies documented          | Active         |
| R7  | Local-only assumptions leak into production planning               | Medium      | Medium | Document environment dependencies and production gaps explicitly                            | Active         |
| R8  | Token/session handling expectations are unclear to users           | Medium      | Medium | Keep API docs, token rotation guidance, and account-vs-instance token distinctions explicit | Active         |

## Priority Risks

The highest-priority current risks are:

- R2 runtime reliability
- R4 incomplete production hardening
- R5 uncontrolled UX scope expansion

These should drive near-term planning decisions.
