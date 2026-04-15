# Project Overview

Status date: 2026-04-12

## Purpose

Elite Message is a multi-tenant messaging platform intended to let customers create and manage WhatsApp-linked instances, send and observe messages through APIs and dashboards, and let platform administrators oversee workspaces, workers, support cases, audit trails, and operational health.

## Business Problem

Organizations that rely on WhatsApp delivery often need:

- a managed way to operate multiple sending instances
- a customer-facing workspace for runtime control and API use
- an admin-facing control plane for operations and support
- traceability for messages, lifecycle events, tokens, and incidents

Elite Message addresses that by combining customer self-service, admin supervision, and worker-driven runtime execution in one platform.

## Product Scope Summary

Current repository scope includes:

- customer signup, signin, Google OAuth, and session management
- admin signin and MFA-capable authentication flow
- workspace and membership management
- instance creation, lifecycle operations, runtime visibility, QR/auth state, and token management
- outbound/inbound messaging records and webhook delivery tracking
- public API usage via account and instance tokens
- support, audit, workers, and admin operational screens

## Current Technical Baseline

- Monorepo: `pnpm` + `Turborepo`
- Web apps: Next.js 16 and React 19
- API: NestJS 11 with Express 5 and Socket.IO
- Worker: BullMQ + Redis + `whatsapp-web.js`
- Database: PostgreSQL via Prisma 7
- Object storage: MinIO / S3-compatible
- Observability: Prometheus, Alertmanager, Grafana

## Current Product Status

The codebase is beyond foundation stage. It already contains working customer/admin applications, API and worker services, operational data models, public API documentation UI, and local observability assets. It should be treated as an active MVP-to-post-MVP platform rather than a project bootstrap.

## Target Users

- customer workspace owners and operators
- platform administrators
- support and operations staff
- backend integrators consuming Elite Message APIs

## Success Criteria

- customers can authenticate, create instances, link WhatsApp, retrieve tokens, and call APIs
- admins can supervise workspaces, workers, messaging activity, support, and audit history
- runtime state, operations, and delivery history are visible and traceable
- the platform is maintainable through shared contracts, typed config, and a documented architecture
