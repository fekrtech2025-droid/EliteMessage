# Elite Message

Elite Message is a multi-application messaging platform with customer and admin web surfaces, a NestJS API, a worker runtime, and shared platform packages.

## Current-State Documentation

The most accurate project documentation is the current-state documentation set under:

- [Current-State Documentation Index](/Volumes/MACOS/EliteMessage/docs/current-status/README.md)
- [cPanel Deployment Guide](/Volumes/MACOS/EliteMessage/docs/cpanel-deployment.md)

Older documents in `docs/` remain useful as historical or reference material, but they do not fully represent the repository's present implementation status.

## Stack

- `pnpm` workspaces + `Turborepo`
- `Next.js` for customer and admin dashboards
- `NestJS` for the control plane API
- `Node.js` worker service for runtime orchestration shells
- `PostgreSQL` + `Prisma`
- `Redis` + `BullMQ`
- `MinIO` for local S3-compatible storage

## Repository Layout

- `apps/customer-web`: customer dashboard shell
- `apps/admin-web`: admin dashboard shell
- `apps/api`: control-plane API shell
- `apps/worker`: worker runtime shell
- `packages/contracts`: shared enums, route groups, queue names, schemas
- `packages/config`: env parsing, logger, runtime constants
- `packages/db`: Prisma schema, migrations, DB utilities
- `packages/ui`: shared UI primitives
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TS config

## Prerequisites

- Node `20.19.x` or `22.x`
- `corepack` enabled
- Docker / Docker Compose, or local PostgreSQL + Redis
- local infra downloads and caches are kept inside this repository on the mounted volume:
  - `.pnpm-store`
  - `.local`

## Local Setup

1. Copy `.env.example` to `.env`.
2. Enable pnpm with `corepack enable` and `corepack prepare pnpm@10.33.0 --activate`.
3. Install dependencies with `pnpm install`.
4. Start infrastructure with `pnpm dev:infra`.
5. Run database migrations with `pnpm db:migrate`.
6. Start the workspace with `pnpm dev`.

If Docker is unavailable, `pnpm dev:infra` falls back to:

- local PostgreSQL service bootstrap
- local Redis check/start
- a lightweight S3/MinIO-compatible storage mock under `.local/`

## Running The Project Locally

This section is the detailed, end-to-end flow for bringing the repository up on a new machine.

### 1. Confirm prerequisites

Before running anything, make sure the machine has:

- Node `20.19.x` or `22.x`
- `corepack`
- either Docker, or local PostgreSQL and Redis tooling available on `PATH`
- the default local ports available:
  - `3000` customer web
  - `3001` admin web
  - `3002` API
  - `3003` worker
  - `5432` PostgreSQL
  - `6379` Redis
  - `9000` S3/MinIO-compatible storage

If Docker is not installed, the local bootstrap expects local database/Redis tools such as `psql`, `createdb`, `redis-server`, and `redis-cli` to be available.

### 2. Prepare the environment file

Create a local env file from the example:

```bash
cp .env.example .env
```

For a first local run, the checked-in defaults in `.env.example` are already aligned with the repository scripts, so in most cases you only need to copy the file and do not need additional edits.

Important defaults from `.env`:

- customer web: `http://localhost:3000`
- admin web: `http://localhost:3001`
- API: `http://localhost:3002`
- PostgreSQL database: `elite_message`
- Redis: `redis://localhost:6379`
- S3-compatible endpoint: `http://localhost:9000`

### 3. Enable pnpm and install dependencies

From the repository root:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install
```

This repository is a `pnpm` workspace managed by Turborepo, so dependencies should be installed from the root, not from individual app folders.

### 4. Start infrastructure

Run:

```bash
pnpm dev:infra
```

What this command does:

- if Docker is available, it starts `postgres`, `redis`, and `minio` from `docker-compose.yml`
- if Docker is not available, it falls back to local-service mode
- in local-service mode it:
  - checks or starts PostgreSQL
  - ensures the local database role and database can be created
  - checks or starts Redis
  - starts a lightweight S3-compatible storage mock under `.local/` unless `ELITE_STORAGE_MODE=minio` is set

You only need to run this once per local session unless you stop the services.

### 5. Bootstrap the database and seed development data

Run:

```bash
pnpm db:migrate
```

What this command does:

- ensures the local PostgreSQL role and database exist when using a local host
- applies Prisma migrations
- seeds development bootstrap data

The seed creates default local accounts:

- admin account: `admin@elite.local` / `Admin123456!`
- customer account: `owner@elite.local` / `Customer123456!`

### 6. Start the workspace

Run:

```bash
pnpm dev
```

This command first builds the shared packages, then starts the monorepo in watch mode. The main processes started by this command are:

- customer web app on port `3000`
- admin web app on port `3001`
- API on port `3002`
- worker on port `3003`
- watch builds for shared packages in `packages/`

Keep this terminal open while you work.

### 7. Open the running services

Once the dev servers are ready, use:

- customer web: `http://localhost:3000`
- admin web: `http://localhost:3001`
- API health: `http://localhost:3002/health`

Note: the API root path `/` may return `404`. That is normal here; use `/health` to verify the API is up.

### 8. Optional: run the real browser-backed WhatsApp worker

The default `pnpm dev` flow starts the normal worker service. If you want the real `whatsapp_web` browser-backed worker session, use a second terminal and run:

```bash
pnpm dev:worker:whatsapp-web
```

Before doing that:

1. Make sure Chrome, Chromium, or Edge is installed.
2. Set `WORKER_WA_BROWSER_EXECUTABLE_PATH` in `.env` if auto-detection is not correct on your machine.
3. Keep the runtime directory on the mounted volume:

```bash
WORKER_SESSION_STORAGE_DIR=/Volumes/MACOS/EliteMessage/.runtime/worker-sessions
```

Useful worker flags:

- `WORKER_WA_CAPTURE_SCREENSHOTS=true`
- `WORKER_WA_DOWNLOAD_INBOUND_MEDIA=true`
- `WORKER_WA_AUTO_RECOVERY_DELAY_MS=5000`

### 9. Stop the project

To stop the application processes:

1. Press `Ctrl+C` in the terminal running `pnpm dev`.
2. Stop infrastructure when you no longer need it:

```bash
pnpm dev:infra:stop
```

That command stops repo-managed local Redis/MinIO processes and also brings Docker infrastructure down when Docker mode is in use.

### 10. Common local run sequence

If you want the shortest reliable sequence, this is the one to use from the repository root:

```bash
cp .env.example .env
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install
pnpm dev:infra
pnpm db:migrate
pnpm dev
```

## Core Scripts

- `pnpm dev`: build shared packages once, then start all apps in watch mode
- `pnpm dev:worker:whatsapp-web`: start the worker in real `whatsapp_web` mode using a local Chrome/Chromium/Edge executable
- `pnpm dev:infra`: start PostgreSQL, Redis, and MinIO using Docker when available, otherwise local-service mode
- `pnpm dev:infra:stop`: stop repo-managed local Redis/MinIO processes and bring Docker infra down if used
- `pnpm build`: build all packages and apps
- `pnpm lint`: run ESLint across the monorepo
- `pnpm typecheck`: run TypeScript checks
- `pnpm test`: run workspace tests
- `pnpm db:migrate`: bootstrap the local database role/database when needed, then apply Prisma migrations
- `pnpm db:reset`: reset and re-apply Prisma migrations

## Branching

- `main` is the trunk branch
- use short-lived feature branches
- merge through pull requests with CI passing

## Current Implementation Snapshot

The repository now includes product features beyond initial scaffolding, including:

- customer authentication, customer dashboard routes, instance management, messaging views, and API documentation
- admin authentication, admin MFA support, and operational pages for users, workspaces, workers, support, audit, and messages
- worker-backed runtime flows, lifecycle state, queues, and observability-related assets
- a production-oriented Prisma schema covering users, workspaces, memberships, instances, tokens, messages, webhook deliveries, audit logs, worker heartbeats, and support cases

## Phase 3B Bring-Up

To run a real browser-backed worker session:

1. Ensure Chrome, Chromium, or Edge is installed on this machine.
2. Set `WORKER_WA_BROWSER_EXECUTABLE_PATH` in `.env` if you do not want the default path detection.
3. Keep the runtime directory on the external volume:
   - `WORKER_SESSION_STORAGE_DIR=/Volumes/MACOS/EliteMessage/.runtime/worker-sessions`
4. Start infra and the API/web apps:
   - `pnpm dev:infra`
   - `pnpm db:migrate`
   - `pnpm dev`
5. In a second terminal, start the real worker:
   - `pnpm dev:worker:whatsapp-web`

Useful worker flags in `.env`:

- `WORKER_WA_CAPTURE_SCREENSHOTS=true` to save QR/ready/disconnect screenshots
- `WORKER_WA_DOWNLOAD_INBOUND_MEDIA=true` to persist inbound media files under the external runtime directory
- `WORKER_WA_AUTO_RECOVERY_DELAY_MS=5000` to control reconnect delay after unexpected disconnects
