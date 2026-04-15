# Elite Message

## Database Schema

Version: 1.0  
Prepared for: Elite Message project  
Target database: PostgreSQL 16+

---

## 1. Purpose

This document defines the recommended production database schema for Elite Message, a platform intended to match UltraMsg-style behavior:

- multi-tenant customer accounts
- multiple WhatsApp instances per account
- per-instance API tokens
- long-lived browser-backed sessions
- outbound and inbound message tracking
- webhooks with retries
- customer dashboard and admin dashboard
- subscriptions, support, audit logs, and worker orchestration

This schema is optimized for:

- strong relational integrity
- high write volume on messages and events
- operational visibility
- horizontal worker orchestration
- future reporting and partitioning

---

## 2. Database Choice

Recommended engine:

- `PostgreSQL 16+`

Recommended extensions:

- `pgcrypto` for `gen_random_uuid()`
- `citext` for case-insensitive email uniqueness

Why PostgreSQL:

- strong transactional consistency
- excellent indexing and JSONB support
- better fit than MySQL for event-heavy systems
- native partitioning for very large message/event tables

---

## 3. Schema Conventions

General rules:

- use `uuid` primary keys for internal entities
- use separate human-readable public IDs where needed
- store timestamps as `timestamptz`
- keep mutable current-state tables separate from append-only event tables
- use `jsonb` only for optional or provider-specific payload data
- always index by tenant boundary where applicable

Standard columns used frequently:

- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null` when soft delete is useful

Recommended timestamp trigger:

- one shared trigger function to maintain `updated_at`

---

## 4. Logical Domains

The schema is organized into these logical domains:

- Identity and access
- Accounts and subscriptions
- Instances and runtime control
- Workers and session orchestration
- Messaging
- Contacts, chats, and groups
- Media
- Webhooks
- Support and audit

---

## 5. Enum Catalog

Use PostgreSQL enums or constrained text columns. PostgreSQL enums are recommended for stable states.

### 5.1 User Status

- `active`
- `pending_invite`
- `suspended`
- `deleted`

### 5.2 Account Status

- `active`
- `trialing`
- `past_due`
- `suspended`
- `closed`

### 5.3 Membership Status

- `active`
- `pending`
- `revoked`

### 5.4 Role Scope

- `platform`
- `account`

### 5.5 Instance Status

- `qr`
- `initialize`
- `booting`
- `loading`
- `retrying`
- `authenticated`
- `disconnected`
- `standby`
- `stopped`
- `expired`

### 5.6 Assignment Status

- `assigned`
- `releasing`
- `released`
- `reassigned`

### 5.7 Session Status

- `active`
- `logged_out`
- `cleared`
- `corrupt`
- `expired`

### 5.8 Message Direction

- `inbound`
- `outbound`

### 5.9 Message Type

- `chat`
- `image`
- `document`
- `video`
- `audio`
- `voice`
- `sticker`
- `contact`
- `location`
- `link`
- `reaction`
- `vcard`

### 5.10 Message Status

- `queue`
- `sent`
- `unsent`
- `invalid`
- `expired`

### 5.11 Message ACK

- `pending`
- `server`
- `device`
- `read`
- `played`

### 5.12 Message Source

- `api`
- `dashboard`
- `resend`
- `admin`
- `system`

### 5.13 Worker Status

- `online`
- `degraded`
- `draining`
- `offline`

### 5.14 Webhook Delivery Status

- `pending`
- `retrying`
- `delivered`
- `failed`
- `dead`

### 5.15 Support Priority

- `low`
- `medium`
- `high`
- `urgent`

### 5.16 Support Case Status

- `open`
- `pending_customer`
- `pending_internal`
- `resolved`
- `closed`

### 5.17 Actor Type

- `user`
- `admin`
- `system`
- `worker`

---

## 6. Identity and Access Tables

## 6.1 `users`

Purpose:

- stores all human user identities for customer and admin access

Columns:

- `id uuid pk`
- `email citext not null unique`
- `password_hash text not null`
- `first_name varchar(120) not null`
- `last_name varchar(120) not null`
- `phone varchar(32) null`
- `avatar_url text null`
- `locale varchar(12) not null default 'en'`
- `timezone varchar(64) not null default 'UTC'`
- `status user_status not null default 'active'`
- `email_verified_at timestamptz null`
- `last_login_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Indexes:

- unique index on `email`
- index on `status`
- index on `last_login_at`

## 6.2 `roles`

Purpose:

- stores system-defined and custom roles for both account-level and platform-level access

Columns:

- `id uuid pk`
- `scope role_scope not null`
- `role_key varchar(64) not null`
- `name varchar(120) not null`
- `description text null`
- `is_system boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(scope, role_key)`

## 6.3 `permissions`

Purpose:

- permission catalog

Columns:

- `id uuid pk`
- `permission_key varchar(96) not null unique`
- `name varchar(120) not null`
- `description text null`
- `created_at timestamptz not null default now()`

## 6.4 `role_permissions`

Purpose:

- many-to-many mapping between roles and permissions

Columns:

- `role_id uuid fk -> roles.id`
- `permission_id uuid fk -> permissions.id`
- `created_at timestamptz not null default now()`

Primary key:

- composite primary key `(role_id, permission_id)`

## 6.5 `user_role_bindings`

Purpose:

- attaches a role to a user globally or within an account

Columns:

- `id uuid pk`
- `user_id uuid fk -> users.id`
- `role_id uuid fk -> roles.id`
- `account_id uuid null fk -> accounts.id`
- `granted_by_user_id uuid null fk -> users.id`
- `created_at timestamptz not null default now()`

Constraints:

- for `platform` roles, `account_id` must be null
- for `account` roles, `account_id` must be present

Indexes:

- index on `user_id`
- index on `account_id`
- unique on `(user_id, role_id, account_id)`

---

## 7. Accounts and Subscription Tables

## 7.1 `accounts`

Purpose:

- tenant boundary for all customer data

Columns:

- `id uuid pk`
- `name varchar(150) not null`
- `slug varchar(80) not null unique`
- `owner_user_id uuid fk -> users.id`
- `status account_status not null default 'trialing'`
- `default_locale varchar(12) not null default 'en'`
- `default_timezone varchar(64) not null default 'UTC'`
- `trial_starts_at timestamptz null`
- `trial_ends_at timestamptz null`
- `suspended_at timestamptz null`
- `closed_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- unique on `slug`
- index on `owner_user_id`
- index on `status`

## 7.2 `account_members`

Purpose:

- membership rows linking users to accounts

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `user_id uuid fk -> users.id`
- `membership_status membership_status not null default 'active'`
- `is_owner boolean not null default false`
- `invited_at timestamptz null`
- `joined_at timestamptz null`
- `last_seen_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(account_id, user_id)`
- index on `membership_status`
- index on `last_seen_at`

## 7.3 `plans`

Purpose:

- plan catalog

Columns:

- `id uuid pk`
- `plan_code varchar(64) not null unique`
- `name varchar(120) not null`
- `billing_interval varchar(24) not null`
- `price_minor integer not null`
- `currency varchar(8) not null`
- `instance_limit integer null`
- `daily_send_limit integer null`
- `daily_contact_check_limit integer null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## 7.4 `subscriptions`

Purpose:

- subscription state per account

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `plan_id uuid fk -> plans.id`
- `status varchar(32) not null`
- `starts_at timestamptz not null`
- `ends_at timestamptz null`
- `renews_at timestamptz null`
- `cancels_at timestamptz null`
- `grace_ends_at timestamptz null`
- `is_trial boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- index on `account_id`
- index on `status`
- index on `renews_at`

## 7.5 `invoices`

Purpose:

- billing records

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `subscription_id uuid null fk -> subscriptions.id`
- `invoice_number varchar(64) not null unique`
- `status varchar(32) not null`
- `currency varchar(8) not null`
- `subtotal_minor integer not null`
- `tax_minor integer not null default 0`
- `total_minor integer not null`
- `issued_at timestamptz not null`
- `due_at timestamptz null`
- `paid_at timestamptz null`
- `created_at timestamptz not null default now()`

Indexes:

- index on `account_id`
- index on `status`
- index on `issued_at`

## 7.6 `payments`

Purpose:

- payment transaction references

Columns:

- `id uuid pk`
- `invoice_id uuid fk -> invoices.id`
- `provider varchar(32) not null`
- `provider_payment_id varchar(128) not null`
- `status varchar(32) not null`
- `amount_minor integer not null`
- `currency varchar(8) not null`
- `paid_at timestamptz null`
- `raw_payload jsonb null`
- `created_at timestamptz not null default now()`

Indexes:

- unique on `(provider, provider_payment_id)`
- index on `status`

---

## 8. Instance and Runtime Control Tables

## 8.1 `instances`

Purpose:

- the central table for each WhatsApp instance

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `public_id varchar(32) not null unique`
- `display_name varchar(150) null`
- `wa_display_name varchar(150) null`
- `wa_phone varchar(32) null`
- `wa_jid varchar(160) null`
- `status instance_status not null default 'initialize'`
- `substatus varchar(64) null`
- `current_worker_id uuid null fk -> workers.id`
- `current_session_id uuid null fk -> instance_sessions.id`
- `expires_at timestamptz null`
- `auto_renewal boolean not null default false`
- `is_trial boolean not null default true`
- `last_qr_at timestamptz null`
- `last_authenticated_at timestamptz null`
- `last_disconnected_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Indexes:

- unique on `public_id`
- index on `account_id`
- index on `status`
- index on `expires_at`
- index on `(account_id, status)`

## 8.2 `instance_api_tokens`

Purpose:

- stores rotatable API tokens for per-instance public API access

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `version integer not null`
- `token_hash text not null`
- `token_prefix varchar(12) not null`
- `created_by_user_id uuid null fk -> users.id`
- `rotated_from_id uuid null fk -> instance_api_tokens.id`
- `is_active boolean not null default true`
- `last_used_at timestamptz null`
- `revoked_at timestamptz null`
- `created_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(instance_id, version)`
- unique partial index on `instance_id` where `is_active = true`
- index on `last_used_at`

## 8.3 `account_api_tokens`

Purpose:

- account-level tokens for APIs such as list/create/update instance actions

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `token_hash text not null`
- `token_prefix varchar(12) not null`
- `name varchar(120) not null`
- `is_active boolean not null default true`
- `last_used_at timestamptz null`
- `revoked_at timestamptz null`
- `created_by_user_id uuid null fk -> users.id`
- `created_at timestamptz not null default now()`

Indexes:

- index on `account_id`
- index on `is_active`

## 8.4 `instance_settings`

Purpose:

- mutable operational settings per instance

Columns:

- `instance_id uuid pk fk -> instances.id`
- `send_delay_seconds integer not null default 1`
- `send_delay_max_seconds integer not null default 15`
- `webhook_url text null`
- `webhook_secret_encrypted text null`
- `webhook_retries smallint not null default 3`
- `webhook_timeout_seconds smallint not null default 10`
- `webhook_message_received boolean not null default false`
- `webhook_message_create boolean not null default false`
- `webhook_message_ack boolean not null default false`
- `webhook_message_download_media boolean not null default false`
- `webhook_message_reaction boolean not null default false`
- `max_parallel_sends smallint not null default 1`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## 8.5 `instance_limits`

Purpose:

- stores effective calculated limits per instance

Columns:

- `instance_id uuid pk fk -> instances.id`
- `daily_send_limit integer null`
- `daily_contact_check_limit integer null`
- `max_queue_size integer not null default 10000`
- `message_retention_days integer not null default 60`
- `media_retention_days integer not null default 120`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## 8.6 `instance_state_events`

Purpose:

- append-only record of instance lifecycle transitions

Columns:

- `id bigserial pk`
- `instance_id uuid fk -> instances.id`
- `worker_id uuid null fk -> workers.id`
- `status instance_status not null`
- `substatus varchar(64) null`
- `payload jsonb null`
- `occurred_at timestamptz not null default now()`

Indexes:

- index on `(instance_id, occurred_at desc)`
- index on `(status, occurred_at desc)`

---

## 9. Workers and Session Orchestration Tables

## 9.1 `workers`

Purpose:

- catalog of active worker processes or worker pods

Columns:

- `id uuid pk`
- `worker_key varchar(96) not null unique`
- `node_name varchar(120) null`
- `pod_name varchar(120) null`
- `region varchar(32) null`
- `status worker_status not null default 'online'`
- `capacity integer not null default 1`
- `active_instance_count integer not null default 0`
- `app_version varchar(32) null`
- `last_heartbeat_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- index on `status`
- index on `last_heartbeat_at`

## 9.2 `instance_worker_assignments`

Purpose:

- historical assignment records between instances and workers

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `worker_id uuid fk -> workers.id`
- `assignment_status assignment_status not null default 'assigned'`
- `reason varchar(120) null`
- `assigned_at timestamptz not null default now()`
- `released_at timestamptz null`
- `created_at timestamptz not null default now()`

Indexes:

- index on `instance_id`
- index on `worker_id`
- index on `assignment_status`
- index on `(instance_id, assigned_at desc)`

## 9.3 `instance_sessions`

Purpose:

- session and browser-runtime lineage for an instance

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `worker_id uuid null fk -> workers.id`
- `session_version integer not null`
- `status session_status not null default 'active'`
- `storage_ref text null`
- `profile_storage_key text null`
- `wa_session_key varchar(160) null`
- `qr_last_generated_at timestamptz null`
- `authenticated_at timestamptz null`
- `logged_out_at timestamptz null`
- `cleared_at timestamptz null`
- `last_connected_at timestamptz null`
- `last_screenshot_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(instance_id, session_version)`
- index on `worker_id`
- index on `status`
- index on `(instance_id, created_at desc)`

## 9.4 `worker_events`

Purpose:

- append-only operational events from workers for debugging and admin tooling

Columns:

- `id bigserial pk`
- `worker_id uuid fk -> workers.id`
- `instance_id uuid null fk -> instances.id`
- `event_type varchar(64) not null`
- `severity varchar(16) not null`
- `payload jsonb null`
- `occurred_at timestamptz not null default now()`

Indexes:

- index on `(worker_id, occurred_at desc)`
- index on `(instance_id, occurred_at desc)`
- index on `event_type`

---

## 10. Messaging Tables

## 10.1 `outbound_messages`

Purpose:

- authoritative record for every outbound message request

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `instance_id uuid fk -> instances.id`
- `provider_message_id varchar(160) null`
- `reference_id varchar(128) null`
- `chat_id varchar(160) null`
- `to_phone varchar(32) null`
- `to_jid varchar(160) null`
- `from_jid varchar(160) null`
- `message_type message_type not null`
- `body text null`
- `caption text null`
- `media_asset_id uuid null fk -> media_assets.id`
- `priority smallint not null default 10`
- `status message_status not null default 'queue'`
- `ack message_ack not null default 'pending'`
- `source message_source not null default 'api'`
- `invalid_reason varchar(200) null`
- `error_code varchar(64) null`
- `error_message text null`
- `metadata jsonb not null default '{}'::jsonb`
- `queued_at timestamptz not null default now()`
- `scheduled_at timestamptz null`
- `sent_at timestamptz null`
- `failed_at timestamptz null`
- `expired_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- index on `(instance_id, created_at desc)`
- index on `(instance_id, status, created_at desc)`
- index on `(instance_id, ack, created_at desc)`
- index on `(instance_id, reference_id)`
- index on `(instance_id, to_phone)`
- index on `provider_message_id`

Recommended constraints:

- unique on `(instance_id, provider_message_id)` where `provider_message_id is not null`

## 10.2 `inbound_messages`

Purpose:

- authoritative record for inbound WhatsApp messages

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `instance_id uuid fk -> instances.id`
- `provider_message_id varchar(160) not null`
- `chat_id varchar(160) null`
- `from_jid varchar(160) not null`
- `to_jid varchar(160) null`
- `author_jid varchar(160) null`
- `push_name varchar(160) null`
- `message_type message_type not null`
- `body text null`
- `media_asset_id uuid null fk -> media_assets.id`
- `quoted_provider_message_id varchar(160) null`
- `metadata jsonb not null default '{}'::jsonb`
- `sent_at timestamptz null`
- `received_at timestamptz not null default now()`
- `created_at timestamptz not null default now()`

Indexes:

- unique on `(instance_id, provider_message_id)`
- index on `(instance_id, received_at desc)`
- index on `(instance_id, from_jid)`
- index on `(instance_id, chat_id)`

## 10.3 `message_events`

Purpose:

- append-only event stream for message state changes

Columns:

- `id bigserial pk`
- `account_id uuid fk -> accounts.id`
- `instance_id uuid fk -> instances.id`
- `direction message_direction not null`
- `outbound_message_id uuid null fk -> outbound_messages.id`
- `inbound_message_id uuid null fk -> inbound_messages.id`
- `provider_message_id varchar(160) null`
- `event_type varchar(64) not null`
- `payload jsonb not null default '{}'::jsonb`
- `occurred_at timestamptz not null default now()`

Indexes:

- index on `(instance_id, occurred_at desc)`
- index on `(outbound_message_id, occurred_at desc)`
- index on `(inbound_message_id, occurred_at desc)`
- index on `event_type`

## 10.4 `message_reactions`

Purpose:

- reaction history, useful for webhook and analytics parity

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `provider_message_id varchar(160) not null`
- `reactor_jid varchar(160) not null`
- `emoji varchar(16) not null`
- `action varchar(16) not null`
- `payload jsonb not null default '{}'::jsonb`
- `occurred_at timestamptz not null`
- `created_at timestamptz not null default now()`

Indexes:

- index on `(instance_id, provider_message_id)`
- index on `(instance_id, occurred_at desc)`

## 10.5 `instance_daily_counters`

Purpose:

- fast counters for usage limits and dashboard summaries

Columns:

- `instance_id uuid fk -> instances.id`
- `counter_date date not null`
- `outbound_sent_count integer not null default 0`
- `outbound_queue_count integer not null default 0`
- `outbound_unsent_count integer not null default 0`
- `invalid_count integer not null default 0`
- `expired_count integer not null default 0`
- `inbound_count integer not null default 0`
- `contact_check_count integer not null default 0`
- `updated_at timestamptz not null default now()`

Primary key:

- composite primary key `(instance_id, counter_date)`

---

## 11. Contacts, Chats, and Groups Tables

## 11.1 `contacts`

Purpose:

- cached WhatsApp contact metadata by instance

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `jid varchar(160) not null`
- `phone varchar(32) null`
- `display_name varchar(160) null`
- `push_name varchar(160) null`
- `short_name varchar(120) null`
- `is_business boolean not null default false`
- `is_blocked boolean not null default false`
- `profile_photo_url text null`
- `metadata jsonb not null default '{}'::jsonb`
- `last_synced_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(instance_id, jid)`
- index on `(instance_id, phone)`

## 11.2 `contact_check_cache`

Purpose:

- stores cached existence checks for phone numbers

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `phone varchar(32) not null`
- `wa_exists boolean not null`
- `source varchar(16) not null`
- `checked_at timestamptz not null`
- `expires_at timestamptz not null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Indexes:

- unique on `(instance_id, phone)`
- index on `expires_at`

## 11.3 `chats`

Purpose:

- cached recent chat list and chat state

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `jid varchar(160) not null`
- `chat_type varchar(24) not null`
- `display_name varchar(180) null`
- `archived boolean not null default false`
- `pinned boolean not null default false`
- `is_muted boolean not null default false`
- `unread_count integer not null default 0`
- `last_message_at timestamptz null`
- `last_message_preview text null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(instance_id, jid)`
- index on `(instance_id, last_message_at desc)`

## 11.4 `groups`

Purpose:

- cached group metadata

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `jid varchar(160) not null`
- `subject varchar(200) not null`
- `description text null`
- `owner_jid varchar(160) null`
- `participants_count integer not null default 0`
- `announce_only boolean not null default false`
- `metadata jsonb not null default '{}'::jsonb`
- `last_synced_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(instance_id, jid)`
- index on `(instance_id, subject)`

## 11.5 `group_members`

Purpose:

- participant snapshots for groups

Columns:

- `id uuid pk`
- `group_id uuid fk -> groups.id`
- `member_jid varchar(160) not null`
- `display_name varchar(160) null`
- `is_admin boolean not null default false`
- `is_super_admin boolean not null default false`
- `joined_at timestamptz null`
- `left_at timestamptz null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes and constraints:

- unique on `(group_id, member_jid)`
- index on `(group_id, is_admin)`

---

## 12. Media Tables

## 12.1 `media_assets`

Purpose:

- canonical media storage records for uploads, inbound media, screenshots, and exports

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `instance_id uuid null fk -> instances.id`
- `storage_provider varchar(32) not null`
- `bucket varchar(120) not null`
- `object_key text not null`
- `mime_type varchar(120) not null`
- `original_filename varchar(255) null`
- `sha256 char(64) null`
- `size_bytes bigint not null`
- `width integer null`
- `height integer null`
- `duration_ms integer null`
- `source varchar(32) not null`
- `retention_until timestamptz null`
- `created_by_user_id uuid null fk -> users.id`
- `created_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Indexes:

- index on `account_id`
- index on `instance_id`
- index on `sha256`
- index on `retention_until`

## 12.2 `media_access_logs`

Purpose:

- optional but recommended for signed URL access auditing

Columns:

- `id bigserial pk`
- `media_asset_id uuid fk -> media_assets.id`
- `viewer_user_id uuid null fk -> users.id`
- `access_type varchar(32) not null`
- `ip_address inet null`
- `user_agent text null`
- `accessed_at timestamptz not null default now()`

Indexes:

- index on `(media_asset_id, accessed_at desc)`

---

## 13. Webhook Tables

## 13.1 `webhook_endpoints`

Purpose:

- persistent endpoint definitions for each instance

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `url text not null`
- `secret_encrypted text null`
- `retries smallint not null default 3`
- `timeout_seconds smallint not null default 10`
- `on_message_received boolean not null default false`
- `on_message_create boolean not null default false`
- `on_message_ack boolean not null default false`
- `on_message_download_media boolean not null default false`
- `on_message_reaction boolean not null default false`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `disabled_at timestamptz null`

Indexes and constraints:

- unique partial index on `instance_id` where `is_active = true`

## 13.2 `webhook_deliveries`

Purpose:

- one row per webhook event delivery

Columns:

- `id uuid pk`
- `instance_id uuid fk -> instances.id`
- `account_id uuid fk -> accounts.id`
- `webhook_endpoint_id uuid fk -> webhook_endpoints.id`
- `event_name varchar(64) not null`
- `outbound_message_id uuid null fk -> outbound_messages.id`
- `inbound_message_id uuid null fk -> inbound_messages.id`
- `request_headers jsonb not null default '{}'::jsonb`
- `request_body jsonb not null default '{}'::jsonb`
- `signature varchar(255) null`
- `status webhook_delivery_status not null default 'pending'`
- `attempt_count integer not null default 0`
- `http_status integer null`
- `last_error text null`
- `next_retry_at timestamptz null`
- `last_attempt_at timestamptz null`
- `delivered_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Indexes:

- index on `(instance_id, created_at desc)`
- index on `(status, next_retry_at)`
- index on `(webhook_endpoint_id, created_at desc)`

## 13.3 `webhook_attempts`

Purpose:

- detailed attempt log for each delivery retry

Columns:

- `id uuid pk`
- `delivery_id uuid fk -> webhook_deliveries.id`
- `attempt_number integer not null`
- `http_status integer null`
- `response_headers jsonb null`
- `response_body text null`
- `error_class varchar(120) null`
- `error_message text null`
- `duration_ms integer null`
- `created_at timestamptz not null default now()`

Indexes:

- unique on `(delivery_id, attempt_number)`
- index on `(delivery_id, created_at desc)`

---

## 14. Support and Audit Tables

## 14.1 `support_cases`

Purpose:

- structured support tickets tied to account and optional instance

Columns:

- `id uuid pk`
- `account_id uuid fk -> accounts.id`
- `instance_id uuid null fk -> instances.id`
- `opened_by_user_id uuid null fk -> users.id`
- `assigned_admin_user_id uuid null fk -> users.id`
- `status support_case_status not null default 'open'`
- `priority support_priority not null default 'medium'`
- `subject varchar(200) not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `resolved_at timestamptz null`

Indexes:

- index on `(account_id, created_at desc)`
- index on `(assigned_admin_user_id, status)`
- index on `(status, priority)`

## 14.2 `support_notes`

Purpose:

- notes and conversation log for support cases

Columns:

- `id uuid pk`
- `case_id uuid fk -> support_cases.id`
- `author_user_id uuid fk -> users.id`
- `is_internal boolean not null default true`
- `body text not null`
- `created_at timestamptz not null default now()`

Indexes:

- index on `(case_id, created_at asc)`

## 14.3 `audit_logs`

Purpose:

- immutable history of customer, admin, system, and worker actions

Columns:

- `id bigserial pk`
- `actor_type actor_type not null`
- `actor_user_id uuid null fk -> users.id`
- `account_id uuid null fk -> accounts.id`
- `instance_id uuid null fk -> instances.id`
- `entity_type varchar(80) not null`
- `entity_id varchar(120) not null`
- `action varchar(80) not null`
- `before_state jsonb null`
- `after_state jsonb null`
- `ip_address inet null`
- `user_agent text null`
- `created_at timestamptz not null default now()`

Indexes:

- index on `(account_id, created_at desc)`
- index on `(instance_id, created_at desc)`
- index on `(actor_user_id, created_at desc)`
- index on `(entity_type, entity_id, created_at desc)`
- index on `(action, created_at desc)`

---

## 15. Relationship Summary

Main relationships:

- one `user` can belong to many `accounts` through `account_members`
- one `account` owns many `instances`
- one `instance` has many `instance_api_tokens` over time
- one `instance` has one active `instance_settings` row
- one `instance` has one active `instance_limits` row
- one `instance` can have many `instance_sessions`
- one `instance` can have many `instance_state_events`
- one `worker` can host many instances over time, but one active assignment per instance
- one `instance` has many `outbound_messages`
- one `instance` has many `inbound_messages`
- messages generate many `message_events`
- one `instance` can have many `contacts`, `chats`, and `groups`
- one `group` has many `group_members`
- one `instance` can have one active `webhook_endpoint`
- one `webhook_delivery` has many `webhook_attempts`
- one `account` can have many `support_cases`, `subscriptions`, `invoices`, and `audit_logs`

---

## 16. Recommended Index Strategy

High-volume indexes that matter most:

- `outbound_messages (instance_id, status, created_at desc)`
- `outbound_messages (instance_id, ack, created_at desc)`
- `inbound_messages (instance_id, received_at desc)`
- `message_events (instance_id, occurred_at desc)`
- `instance_state_events (instance_id, occurred_at desc)`
- `webhook_deliveries (status, next_retry_at)`
- `audit_logs (account_id, created_at desc)`

Rules:

- index by tenant key first for large shared tables
- avoid unnecessary indexes on huge event tables
- prefer partial indexes for active rows
- review bloat regularly on message and event tables

---

## 17. Partitioning Recommendations

These tables should be partitioned when production volume grows:

- `outbound_messages`
- `inbound_messages`
- `message_events`
- `instance_state_events`
- `webhook_deliveries`
- `webhook_attempts`
- `audit_logs`

Recommended strategy:

- monthly range partitioning on `created_at` or `occurred_at`

Benefits:

- faster retention cleanup
- smaller index footprints
- easier archival

---

## 18. Retention Policy Recommendations

Suggested policies:

- `outbound_messages`: 60 to 120 days hot retention depending on plan
- `inbound_messages`: 60 to 120 days hot retention
- `message_events`: 30 to 90 days hot retention
- `webhook_attempts`: 30 days
- `worker_events`: 14 to 30 days
- `audit_logs`: 180 to 365 days
- `media_assets`: based on plan and storage policy

Retention jobs should:

- run through queues
- archive before delete where required
- update counters and references safely

---

## 19. Security Notes

Sensitive fields:

- `password_hash`
- `token_hash`
- `webhook_secret_encrypted`
- `storage_ref`
- `profile_storage_key`

Rules:

- never store raw instance tokens or account API tokens after creation
- encrypt any persisted browser session artifact reference if it can expose session material
- redact tokens and message bodies from logs where possible
- avoid storing admin screenshots indefinitely

---

## 20. Minimal SQL Bootstrap

Below is a compact bootstrap example for core types and two core tables. The full implementation should still be generated through migrations.

```sql
create extension if not exists pgcrypto;
create extension if not exists citext;

create type user_status as enum ('active', 'pending_invite', 'suspended', 'deleted');
create type account_status as enum ('active', 'trialing', 'past_due', 'suspended', 'closed');
create type instance_status as enum (
  'qr', 'initialize', 'booting', 'loading', 'retrying',
  'authenticated', 'disconnected', 'standby', 'stopped', 'expired'
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  password_hash text not null,
  first_name varchar(120) not null,
  last_name varchar(120) not null,
  phone varchar(32),
  locale varchar(12) not null default 'en',
  timezone varchar(64) not null default 'UTC',
  status user_status not null default 'active',
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table accounts (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null,
  slug varchar(80) not null unique,
  owner_user_id uuid not null references users(id),
  status account_status not null default 'trialing',
  default_locale varchar(12) not null default 'en',
  default_timezone varchar(64) not null default 'UTC',
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  suspended_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table instances (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  public_id varchar(32) not null unique,
  display_name varchar(150),
  wa_display_name varchar(150),
  wa_phone varchar(32),
  wa_jid varchar(160),
  status instance_status not null default 'initialize',
  substatus varchar(64),
  current_worker_id uuid,
  current_session_id uuid,
  expires_at timestamptz,
  auto_renewal boolean not null default false,
  is_trial boolean not null default true,
  last_qr_at timestamptz,
  last_authenticated_at timestamptz,
  last_disconnected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_instances_account_status on instances (account_id, status);
create index idx_instances_expires_at on instances (expires_at);
```

---

## 21. Final Recommendation

This schema is the right baseline for Elite Message if the project is intended to match UltraMsg-like behavior in production.

The most important implementation choices are:

- use PostgreSQL
- keep instances as first-class records
- model workers and sessions explicitly
- treat messages and state changes as append-heavy event data
- store current settings in snapshot tables
- partition large message and event tables before scale forces an emergency migration

This schema gives you:

- clean tenant boundaries
- enough operational visibility for an admin dashboard
- proper support for per-instance tokens, queues, and lifecycle states
- room to scale without redesigning the database after launch
