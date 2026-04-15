# Elite Message

## API Route List

Version: 1.0  
Prepared for: Elite Message project  
Target style: UltraMsg-equivalent API surface with customer dashboard, admin dashboard, and worker-backed instance runtime

---

## 1. Purpose

This document defines the recommended API route list for Elite Message.

The route catalog is organized into these groups:

- authentication and session routes
- customer account routes
- customer dashboard routes
- admin dashboard routes
- account-level API routes
- per-instance public API routes
- internal worker routes
- realtime routes
- health and operations routes

The design goal is to support:

- a customer-facing web application
- an admin-facing web application
- external API consumers
- internal worker orchestration
- future UltraMsg-compatible endpoint aliases

---

## 2. API Surface Overview

Recommended base prefixes:

- `/api/v1/auth`
- `/api/v1/account`
- `/api/v1/customer`
- `/api/v1/admin`
- `/api/v1/public`
- `/api/v1/internal`
- `/socket.io`

Compatibility aliases:

- `/api/list`
- `/api/create`
- `/api/update`
- `/instance/{instanceId}/...`

Authentication modes:

- dashboard bearer session or cookie auth for customer/admin routes
- account API token for account-level API routes
- instance API token for per-instance public routes
- internal service token or mTLS for worker routes

---

## 3. Auth Routes

## 3.1 Customer Authentication

### `POST /api/v1/auth/login`

Purpose:

- customer login

Body:

- `email`
- `password`

Response:

- access token
- refresh token
- user profile
- account summary

### `POST /api/v1/auth/logout`

Purpose:

- revoke current login session

### `POST /api/v1/auth/refresh`

Purpose:

- exchange refresh token for new access token

### `POST /api/v1/auth/forgot-password`

Purpose:

- start password reset flow

### `POST /api/v1/auth/reset-password`

Purpose:

- complete password reset

### `GET /api/v1/auth/me`

Purpose:

- fetch current authenticated customer identity

## 3.2 Admin Authentication

### `POST /api/v1/auth/admin/login`

Purpose:

- admin login

### `POST /api/v1/auth/admin/logout`

Purpose:

- admin logout

### `POST /api/v1/auth/admin/refresh`

Purpose:

- refresh admin access token

### `POST /api/v1/auth/admin/mfa/challenge`

Purpose:

- initiate MFA challenge

### `POST /api/v1/auth/admin/mfa/verify`

Purpose:

- verify MFA code

### `GET /api/v1/auth/admin/me`

Purpose:

- fetch current authenticated admin

---

## 4. Customer Account Routes

## 4.1 Profile and Membership

### `GET /api/v1/account/profile`

Purpose:

- get current user profile

### `PATCH /api/v1/account/profile`

Purpose:

- update name, locale, timezone, phone

### `PATCH /api/v1/account/password`

Purpose:

- change password

### `GET /api/v1/account/members`

Purpose:

- list account members

### `POST /api/v1/account/members`

Purpose:

- invite member

### `PATCH /api/v1/account/members/{memberId}`

Purpose:

- change member role or status

### `DELETE /api/v1/account/members/{memberId}`

Purpose:

- remove member from account

## 4.2 Account API Tokens

### `GET /api/v1/account/api-tokens`

Purpose:

- list account API tokens

### `POST /api/v1/account/api-tokens`

Purpose:

- create account API token

### `POST /api/v1/account/api-tokens/{tokenId}/rotate`

Purpose:

- rotate account API token

### `DELETE /api/v1/account/api-tokens/{tokenId}`

Purpose:

- revoke account API token

## 4.3 Billing

### `GET /api/v1/account/subscription`

Purpose:

- get current subscription and limits

### `GET /api/v1/account/plans`

Purpose:

- list purchasable plans

### `POST /api/v1/account/subscription/checkout`

Purpose:

- start checkout for plan purchase or renewal

### `POST /api/v1/account/subscription/cancel`

Purpose:

- cancel renewal

### `POST /api/v1/account/subscription/enable-auto-renewal`

Purpose:

- enable auto renewal

### `POST /api/v1/account/subscription/disable-auto-renewal`

Purpose:

- disable auto renewal

### `GET /api/v1/account/invoices`

Purpose:

- list invoices

### `GET /api/v1/account/invoices/{invoiceId}`

Purpose:

- get invoice detail

---

## 5. Customer Dashboard Routes

These routes power the customer web app and are authenticated with dashboard auth, not instance tokens.

## 5.1 Overview

### `GET /api/v1/customer/dashboard/overview`

Purpose:

- account summary stats
- instance counts
- daily messaging usage
- webhook health summary

### `GET /api/v1/customer/dashboard/activity`

Purpose:

- recent account activity feed

## 5.2 Instances

### `GET /api/v1/customer/instances`

Purpose:

- list instances for the current account

Query params:

- `status`
- `search`
- `page`
- `limit`
- `sort`

### `POST /api/v1/customer/instances`

Purpose:

- create instance from dashboard

Body:

- `displayName`

### `GET /api/v1/customer/instances/{instanceId}`

Purpose:

- fetch instance summary

### `PATCH /api/v1/customer/instances/{instanceId}`

Purpose:

- rename instance or update display metadata

### `DELETE /api/v1/customer/instances/{instanceId}`

Purpose:

- soft delete instance

### `POST /api/v1/customer/instances/{instanceId}/rotate-token`

Purpose:

- rotate per-instance API token

### `POST /api/v1/customer/instances/{instanceId}/restart`

Purpose:

- restart instance worker/runtime

### `POST /api/v1/customer/instances/{instanceId}/logout`

Purpose:

- log out WhatsApp session and return to QR

### `POST /api/v1/customer/instances/{instanceId}/clear`

Purpose:

- clear messages, settings, and session

### `POST /api/v1/customer/instances/{instanceId}/takeover`

Purpose:

- resolve conflict and force current worker session takeover

### `POST /api/v1/customer/instances/{instanceId}/troubleshoot/soft-reset`

Purpose:

- soft reset recovery action

### `POST /api/v1/customer/instances/{instanceId}/troubleshoot/hard-reset`

Purpose:

- full recovery and worker reassignment

### `GET /api/v1/customer/instances/{instanceId}/screenshot`

Purpose:

- fetch worker screenshot preview

### `GET /api/v1/customer/instances/{instanceId}/status`

Purpose:

- current status snapshot

### `GET /api/v1/customer/instances/{instanceId}/limits`

Purpose:

- current effective limits and usage

### `GET /api/v1/customer/instances/{instanceId}/statistics`

Purpose:

- message status counters

## 5.3 Instance Settings

### `GET /api/v1/customer/instances/{instanceId}/settings`

Purpose:

- fetch instance settings

### `PATCH /api/v1/customer/instances/{instanceId}/settings`

Purpose:

- update send delays and webhook settings

Body examples:

- `sendDelaySeconds`
- `sendDelayMaxSeconds`
- `webhookUrl`
- `webhookRetries`
- event toggle flags

## 5.4 Messages

### `GET /api/v1/customer/instances/{instanceId}/messages`

Purpose:

- list outbound message logs for dashboard

Query params:

- `status`
- `ack`
- `referenceId`
- `from`
- `to`
- `id`
- `page`
- `limit`
- `sort`

### `GET /api/v1/customer/instances/{instanceId}/messages/{messageId}`

Purpose:

- get single outbound message detail

### `POST /api/v1/customer/instances/{instanceId}/messages/{messageId}/resend`

Purpose:

- resend one message

### `POST /api/v1/customer/instances/{instanceId}/messages/resend-by-status`

Purpose:

- resend all messages by status

Body:

- `status`

### `POST /api/v1/customer/instances/{instanceId}/messages/clear`

Purpose:

- clear message logs by status

Body:

- `status`

### `GET /api/v1/customer/instances/{instanceId}/messages/statistics`

Purpose:

- fetch queue, sent, unsent, invalid, expired counts

## 5.5 Chats, Contacts, Groups

### `GET /api/v1/customer/instances/{instanceId}/chats`

Purpose:

- dashboard chat list

### `GET /api/v1/customer/instances/{instanceId}/chats/{chatId}/messages`

Purpose:

- list recent chat messages

### `POST /api/v1/customer/instances/{instanceId}/chats/{chatId}/mark-read`

Purpose:

- mark chat as read

### `POST /api/v1/customer/instances/{instanceId}/chats/{chatId}/archive`

Purpose:

- archive chat

### `POST /api/v1/customer/instances/{instanceId}/chats/{chatId}/unarchive`

Purpose:

- unarchive chat

### `GET /api/v1/customer/instances/{instanceId}/contacts`

Purpose:

- list cached contacts

### `GET /api/v1/customer/instances/{instanceId}/contacts/check`

Purpose:

- contact existence check

Query params:

- `phone`
- `nocache`

### `POST /api/v1/customer/instances/{instanceId}/contacts/{contactId}/block`

Purpose:

- block contact

### `POST /api/v1/customer/instances/{instanceId}/contacts/{contactId}/unblock`

Purpose:

- unblock contact

### `GET /api/v1/customer/instances/{instanceId}/groups`

Purpose:

- list groups

### `GET /api/v1/customer/instances/{instanceId}/groups/{groupId}`

Purpose:

- group detail

### `GET /api/v1/customer/instances/{instanceId}/groups/{groupId}/members`

Purpose:

- list group members

## 5.6 Media Utilities

### `POST /api/v1/customer/instances/{instanceId}/media/upload`

Purpose:

- upload dashboard media for future sends

### `DELETE /api/v1/customer/instances/{instanceId}/media/{mediaId}`

Purpose:

- delete stored media asset

### `GET /api/v1/customer/instances/{instanceId}/media/{mediaId}`

Purpose:

- get media metadata or signed URL

---

## 6. Admin Dashboard Routes

These routes are for internal operations only and require admin auth plus RBAC.

## 6.1 Overview

### `GET /api/v1/admin/dashboard/overview`

Purpose:

- global health summary

### `GET /api/v1/admin/dashboard/metrics`

Purpose:

- platform metrics rollup

### `GET /api/v1/admin/dashboard/incidents`

Purpose:

- active incidents and degraded services

## 6.2 Users and Accounts

### `GET /api/v1/admin/users`

Purpose:

- search users

### `GET /api/v1/admin/users/{userId}`

Purpose:

- user detail

### `PATCH /api/v1/admin/users/{userId}`

Purpose:

- admin updates to user state

### `GET /api/v1/admin/accounts`

Purpose:

- search accounts

### `GET /api/v1/admin/accounts/{accountId}`

Purpose:

- account detail

### `PATCH /api/v1/admin/accounts/{accountId}`

Purpose:

- update account status or profile

### `POST /api/v1/admin/accounts/{accountId}/suspend`

Purpose:

- suspend account

### `POST /api/v1/admin/accounts/{accountId}/unsuspend`

Purpose:

- unsuspend account

### `POST /api/v1/admin/accounts/{accountId}/extend-trial`

Purpose:

- extend trial

## 6.3 Instances

### `GET /api/v1/admin/instances`

Purpose:

- global instance search

### `GET /api/v1/admin/instances/{instanceId}`

Purpose:

- admin instance detail

### `GET /api/v1/admin/instances/{instanceId}/events`

Purpose:

- instance lifecycle events

### `GET /api/v1/admin/instances/{instanceId}/worker`

Purpose:

- current worker assignment and health

### `POST /api/v1/admin/instances/{instanceId}/restart`

Purpose:

- restart instance

### `POST /api/v1/admin/instances/{instanceId}/logout`

Purpose:

- force logout session

### `POST /api/v1/admin/instances/{instanceId}/clear`

Purpose:

- force clear instance

### `POST /api/v1/admin/instances/{instanceId}/rotate-token`

Purpose:

- rotate token on behalf of customer

### `POST /api/v1/admin/instances/{instanceId}/reassign-worker`

Purpose:

- move instance to another worker

### `GET /api/v1/admin/instances/{instanceId}/screenshot`

Purpose:

- admin screenshot view

## 6.4 Workers

### `GET /api/v1/admin/workers`

Purpose:

- list worker processes or pods

### `GET /api/v1/admin/workers/{workerId}`

Purpose:

- worker detail

### `GET /api/v1/admin/workers/{workerId}/events`

Purpose:

- worker event log

### `POST /api/v1/admin/workers/{workerId}/drain`

Purpose:

- mark worker as draining

### `POST /api/v1/admin/workers/{workerId}/resume`

Purpose:

- resume worker

### `POST /api/v1/admin/workers/{workerId}/restart`

Purpose:

- restart worker runtime

## 6.5 Global Messages and Webhooks

### `GET /api/v1/admin/messages`

Purpose:

- cross-account message search

### `GET /api/v1/admin/messages/{messageId}`

Purpose:

- message detail

### `GET /api/v1/admin/webhooks/deliveries`

Purpose:

- delivery search

### `GET /api/v1/admin/webhooks/deliveries/{deliveryId}`

Purpose:

- delivery detail

### `POST /api/v1/admin/webhooks/deliveries/{deliveryId}/replay`

Purpose:

- replay webhook delivery

### `POST /api/v1/admin/webhooks/endpoints/{endpointId}/disable`

Purpose:

- disable webhook endpoint

## 6.6 Billing and Support

### `GET /api/v1/admin/invoices`

Purpose:

- global invoice search

### `GET /api/v1/admin/subscriptions`

Purpose:

- global subscription list

### `GET /api/v1/admin/support/cases`

Purpose:

- support case list

### `POST /api/v1/admin/support/cases`

Purpose:

- create support case

### `GET /api/v1/admin/support/cases/{caseId}`

Purpose:

- support case detail

### `POST /api/v1/admin/support/cases/{caseId}/notes`

Purpose:

- add support note

### `POST /api/v1/admin/support/cases/{caseId}/resolve`

Purpose:

- resolve support case

## 6.7 Audit and Risk

### `GET /api/v1/admin/audit-logs`

Purpose:

- searchable audit history

### `GET /api/v1/admin/risk/flags`

Purpose:

- list abuse or risk flags

### `POST /api/v1/admin/risk/flags/{flagId}/resolve`

Purpose:

- resolve risk flag

### `POST /api/v1/admin/accounts/{accountId}/rate-limit`

Purpose:

- apply account-level rate control

---

## 7. Account-Level Public API Routes

These routes are for external customer systems authenticated with account API token.

Recommended auth:

- `Authorization: Bearer {account_api_token}`

Compatibility support should also allow:

- query string token for UltraMsg-style parity

## 7.1 List Instances

### `GET /api/v1/public/account/instances`

Purpose:

- list all instances under the account

Query params:

- `status`
- `page`
- `limit`
- `sort`

Compatibility alias:

- `GET /api/list`

## 7.2 Create Instance

### `POST /api/v1/public/account/instances`

Purpose:

- create instance via API

Body:

- `name`

Compatibility alias:

- `POST /api/create`

## 7.3 Update Instance

### `PATCH /api/v1/public/account/instances/{instanceId}`

Purpose:

- update instance metadata

Body:

- `name`

Compatibility alias:

- `POST /api/update`

---

## 8. Per-Instance Public API Routes

These routes are the core UltraMsg-like surface. They should support both:

- `Authorization: Bearer {instance_token}`
- `?token={instance_token}` for compatibility

Base path:

- `/instance/{instanceId}`

---

## 8.1 Instance Runtime Routes

### `GET /instance/{instanceId}/instance/status`

Purpose:

- get runtime status

### `GET /instance/{instanceId}/instance/me`

Purpose:

- get current WhatsApp identity metadata

### `GET /instance/{instanceId}/instance/settings`

Purpose:

- fetch instance settings

### `POST /instance/{instanceId}/instance/settings`

Purpose:

- update instance settings

### `GET /instance/{instanceId}/instance/qr`

Purpose:

- QR image endpoint

### `GET /instance/{instanceId}/instance/qrCode`

Purpose:

- QR code payload or QR representation

### `POST /instance/{instanceId}/instance/restart`

Purpose:

- restart runtime

### `POST /instance/{instanceId}/instance/logout`

Purpose:

- clear session and go back to QR

### `POST /instance/{instanceId}/instance/clear`

Purpose:

- clear settings, session, and logs

### `POST /instance/{instanceId}/instance/takeover`

Purpose:

- conflict takeover

### `GET /instance/{instanceId}/instance/screenshot`

Purpose:

- runtime screenshot

Supported query params:

- `encoding=base64`

---

## 8.2 Outbound Messaging Routes

### `POST /instance/{instanceId}/messages/chat`

Purpose:

- send text message

Body:

- `to`
- `body`
- `priority`
- `referenceId`

### `POST /instance/{instanceId}/messages/image`

Purpose:

- send image

Body examples:

- `to`
- `image`
- `caption`
- `filename`
- `priority`

### `POST /instance/{instanceId}/messages/document`

Purpose:

- send document

### `POST /instance/{instanceId}/messages/video`

Purpose:

- send video

### `POST /instance/{instanceId}/messages/audio`

Purpose:

- send audio

### `POST /instance/{instanceId}/messages/voice`

Purpose:

- send push-to-talk style voice message

### `POST /instance/{instanceId}/messages/sticker`

Purpose:

- send sticker

### `POST /instance/{instanceId}/messages/contact`

Purpose:

- send contact

### `POST /instance/{instanceId}/messages/location`

Purpose:

- send location

### `POST /instance/{instanceId}/messages/vcard`

Purpose:

- send vCard

### `POST /instance/{instanceId}/messages/reaction`

Purpose:

- send reaction

### `POST /instance/{instanceId}/messages/link`

Purpose:

- optional rich link shortcut if the platform wants parity-style ergonomics

## 8.3 Outbound Message Logs

### `GET /instance/{instanceId}/messages`

Purpose:

- list outbound message records

Query params:

- `page`
- `limit`
- `status`
- `ack`
- `id`
- `referenceId`
- `from`
- `to`
- `sort`

### `GET /instance/{instanceId}/messages/statistics`

Purpose:

- aggregated message counters

### `POST /instance/{instanceId}/messages/resendById`

Purpose:

- resend a single message by id

Body:

- `id`

### `POST /instance/{instanceId}/messages/resendByStatus`

Purpose:

- resend all messages by status

Body:

- `status`

### `POST /instance/{instanceId}/messages/clear`

Purpose:

- clear message logs by status

Body:

- `status`

---

## 8.4 Chats, Contacts, and Groups

### `GET /instance/{instanceId}/chats`

Purpose:

- list chats

### `GET /instance/{instanceId}/chats/messages`

Purpose:

- fetch messages for a chat

Query params:

- `chatId`
- `limit`

### `GET /instance/{instanceId}/chats/ids`

Purpose:

- list normalized chat identifiers

### `POST /instance/{instanceId}/chats/read`

Purpose:

- mark chat as read

### `POST /instance/{instanceId}/chats/archive`

Purpose:

- archive chat

### `POST /instance/{instanceId}/chats/unarchive`

Purpose:

- unarchive chat

### `POST /instance/{instanceId}/chats/delete`

Purpose:

- delete chat

### `GET /instance/{instanceId}/contacts`

Purpose:

- list contacts

### `GET /instance/{instanceId}/contacts/check`

Purpose:

- check whether a number is on WhatsApp

### `GET /instance/{instanceId}/contacts/ids`

Purpose:

- list normalized contact identifiers

### `POST /instance/{instanceId}/contacts/block`

Purpose:

- block contact

### `POST /instance/{instanceId}/contacts/unblock`

Purpose:

- unblock contact

### `GET /instance/{instanceId}/groups`

Purpose:

- list groups

### `GET /instance/{instanceId}/groups/ids`

Purpose:

- list normalized group identifiers

### `GET /instance/{instanceId}/groups/{groupId}`

Purpose:

- group detail

---

## 8.5 Media Routes

### `POST /instance/{instanceId}/media/upload`

Purpose:

- upload media file or base64 payload

### `POST /instance/{instanceId}/media/delete`

Purpose:

- delete one media asset

### `POST /instance/{instanceId}/media/deleteByDate`

Purpose:

- bulk delete media by retention window

---

## 9. Internal Worker Routes

These routes are not public. They are used by session workers and orchestration services.

Base path:

- `/api/v1/internal`

Auth:

- service token or mTLS

## 9.1 Worker Registration and Health

### `POST /api/v1/internal/workers/register`

Purpose:

- register worker process or pod

### `POST /api/v1/internal/workers/{workerId}/heartbeat`

Purpose:

- push worker heartbeat

### `POST /api/v1/internal/workers/{workerId}/status`

Purpose:

- update worker state

## 9.2 Instance Assignment

### `POST /api/v1/internal/instances/{instanceId}/assign`

Purpose:

- assign worker to instance

### `POST /api/v1/internal/instances/{instanceId}/release`

Purpose:

- release worker assignment

### `POST /api/v1/internal/instances/{instanceId}/state`

Purpose:

- publish instance state update from worker

### `POST /api/v1/internal/instances/{instanceId}/session`

Purpose:

- update session metadata

## 9.3 Message and Event Ingestion

### `POST /api/v1/internal/instances/{instanceId}/events/inbound-message`

Purpose:

- ingest inbound message from worker

### `POST /api/v1/internal/instances/{instanceId}/events/message-ack`

Purpose:

- ingest message ACK transition

### `POST /api/v1/internal/instances/{instanceId}/events/message-status`

Purpose:

- ingest outbound status update

### `POST /api/v1/internal/instances/{instanceId}/events/reaction`

Purpose:

- ingest reaction event

### `POST /api/v1/internal/instances/{instanceId}/events/qr`

Purpose:

- publish fresh QR

### `POST /api/v1/internal/instances/{instanceId}/events/conflict`

Purpose:

- report conflict state

### `POST /api/v1/internal/instances/{instanceId}/events/screenshot`

Purpose:

- upload or register screenshot artifact

---

## 10. Webhook Receiver and Billing Webhook Routes

## 10.1 Payment Provider Webhooks

### `POST /api/v1/public/webhooks/billing/{provider}`

Purpose:

- receive payment provider webhook

## 10.2 Optional Customer Webhook Test Utilities

### `POST /api/v1/customer/instances/{instanceId}/webhooks/test`

Purpose:

- send test webhook to configured endpoint

### `GET /api/v1/customer/instances/{instanceId}/webhooks/deliveries`

Purpose:

- list webhook deliveries for that instance

### `GET /api/v1/customer/instances/{instanceId}/webhooks/deliveries/{deliveryId}`

Purpose:

- webhook delivery detail

---

## 11. Realtime Routes

Realtime transport:

- Socket.IO

Primary endpoint:

- `GET /socket.io`

Namespaces are optional, but rooms should exist for:

- account room
- instance room
- admin global room
- worker monitor room

Recommended auth flows:

- customer dashboard websocket token
- admin dashboard websocket token

Suggested events emitted by server:

- `instance.status.changed`
- `instance.qr.updated`
- `instance.statistics.updated`
- `instance.settings.updated`
- `instance.limits.updated`
- `message.outbound.updated`
- `message.inbound.created`
- `webhook.delivery.updated`
- `worker.health.updated`

---

## 12. Health and Operations Routes

## 12.1 Public Health

### `GET /health`

Purpose:

- basic liveness

### `GET /ready`

Purpose:

- readiness check

## 12.2 Internal Health

### `GET /api/v1/internal/health`

Purpose:

- internal dependency health

### `GET /api/v1/internal/metrics`

Purpose:

- metrics endpoint for Prometheus or internal scraping

---

## 13. Route Naming and Compatibility Notes

Design rules:

- customer and admin dashboards should call versioned REST routes
- public per-instance routes should preserve UltraMsg-style ergonomics
- compatibility aliases should be thin wrappers over the same application services
- internal worker routes must never be exposed to the internet directly

Recommended compatibility strategy:

- build first-class versioned APIs under `/api/v1`
- expose compatibility aliases only where needed
- keep request and response transformations isolated in adapter controllers

---

## 14. Example Request Patterns

## 14.1 Send Text Message

Route:

- `POST /instance/{instanceId}/messages/chat`

Parameters:

- `token`
- `to`
- `body`
- `priority`
- `referenceId`

## 14.2 Get Message Logs

Route:

- `GET /instance/{instanceId}/messages`

Parameters:

- `token`
- `page`
- `limit`
- `status`
- `ack`
- `referenceId`

## 14.3 Update Instance Settings

Route:

- `POST /instance/{instanceId}/instance/settings`

Parameters:

- `token`
- `sendDelaySeconds`
- `sendDelayMaxSeconds`
- `webhookUrl`
- `webhookRetries`
- webhook toggles

---

## 15. Final Recommendation

Elite Message should expose three route layers:

- dashboard routes for customer and admin applications
- public account and instance APIs for external customer systems
- internal orchestration routes for workers and support tooling

If the product goal is real UltraMsg equivalence, the most important routes to get right first are:

- instance create/list/manage
- instance status and QR
- send message routes
- message log and resend routes
- settings and webhook routes
- restart/logout/clear/takeover routes
- admin instance and worker operations routes

That route set is the minimum shape needed to support:

- a usable customer dashboard
- a workable admin dashboard
- a production worker runtime
- an external developer API
- future compatibility with UltraMsg-style integrations
