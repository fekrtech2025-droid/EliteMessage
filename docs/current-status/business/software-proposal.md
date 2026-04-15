# Software Proposal

Status date: 2026-04-12

## Proposal Summary

This proposal positions Elite Message as an operational messaging platform that combines:

- customer self-service for instance creation, API access, and day-to-day runtime work
- administrator tooling for supervision, support, compliance, and intervention
- worker-based execution for QR sessions, lifecycle operations, and queue-backed message processing

## Proposed Solution

Deliver and continue maturing a platform with these layers:

1. Customer surface
   - authentication
   - dashboard and runtime views
   - messaging explorer
   - API documentation and token use

2. Admin surface
   - users, workspaces, workers, support, audit, and messaging oversight

3. Platform API
   - dashboard endpoints
   - admin endpoints
   - internal worker endpoints
   - public instance/account API endpoints

4. Worker runtime
   - WhatsApp session handling
   - operations execution
   - queue processing
   - heartbeat reporting

## Expected Business Outcomes

- reduce manual instance handling by exposing customer self-service
- improve incident handling via centralized admin and audit tooling
- create a reusable API product for backend integrations
- establish a platform that can grow into stronger multi-tenant operational controls

## Why This Architecture Is Appropriate

- web surfaces and runtime worker concerns are separated cleanly
- PostgreSQL and Prisma provide a clear source of truth for multi-tenant records
- Redis and BullMQ fit queue-backed lifecycle and message processing
- Next.js + NestJS keep the stack type-safe and straightforward for a TypeScript team

## Current Recommendation

The project should continue from its current working baseline rather than being replanned as a greenfield build. Recommended near-term focus:

- finish current-state documentation
- continue customer/admin UX refinement
- strengthen operational hardening and production-readiness gaps
- formalize release and support procedures
