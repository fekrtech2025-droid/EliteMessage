# Business Requirements Document (BRD)

Status date: 2026-04-12

## Purpose

This BRD defines the business outcomes Elite Message must support based on the current platform direction and implemented product surfaces.

## Business Objectives

- provide customers with a self-service messaging control plane
- provide administrators with an operational oversight plane
- support API-based message sending and runtime monitoring
- maintain traceability for instance lifecycle, messaging, support, and audit activities

## Business Capabilities Required

### Customer capabilities

- register and authenticate securely
- manage workspaces and instances
- link WhatsApp and monitor runtime status
- retrieve API credentials and understand how to use the API
- review outbound, inbound, and webhook-related activity

### Admin capabilities

- authenticate with stronger controls than customers
- view and manage workspaces, users, instances, and workers
- inspect message and webhook activity globally
- support customers and review audit records

### Platform capabilities

- persist tenant, runtime, and audit data centrally
- support tokenized account and instance API access
- process worker operations and message delivery asynchronously
- expose internal metrics and operational health

## Business Success Measures

- customer can go from signup to first API call without admin intervention
- admin can diagnose workspace or runtime problems from the platform
- support and audit records are sufficient for issue tracing
- common operational work can be completed through the UI without database access

## Current Business Status

The current codebase already implements much of the business surface. The remaining business risk is concentrated in polish, documentation clarity, and production-readiness rather than missing core domain concepts.
