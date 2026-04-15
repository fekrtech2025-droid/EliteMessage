# Elite Message cPanel Deployment Guide

This guide is for deploying Elite Message to a cPanel account that includes:

- `Setup Node.js App`
- `PostgreSQL Databases`
- `Cron Jobs`
- domain and subdomain management

It is written for the repository in its current form: a `pnpm` monorepo with four deployable services.

## Scope

Elite Message is not a single website. A production deployment requires:

- `customer-web` Next.js application
- `admin-web` Next.js application
- `api` NestJS application
- `worker` Node.js worker process
- PostgreSQL
- Redis
- S3-compatible object storage

The application roots and startup files prepared for cPanel are:

| Service      | App root            | Startup file    |
| ------------ | ------------------- | --------------- |
| Customer web | `apps/customer-web` | `cpanel-app.js` |
| Admin web    | `apps/admin-web`    | `cpanel-app.js` |
| API          | `apps/api`          | `cpanel-app.js` |
| Worker       | `apps/worker`       | `cpanel-app.js` |

The cPanel startup files are included in the repository:

- [customer-web cPanel startup](/Volumes/MACOS/EliteMessage/apps/customer-web/cpanel-app.js)
- [admin-web cPanel startup](/Volumes/MACOS/EliteMessage/apps/admin-web/cpanel-app.js)
- [api cPanel startup](/Volumes/MACOS/EliteMessage/apps/api/cpanel-app.js)
- [worker cPanel startup](/Volumes/MACOS/EliteMessage/apps/worker/cpanel-app.js)

## Important Constraints

Before deploying, be clear about these constraints:

1. Redis is required. This codebase uses BullMQ and Redis-backed worker flows. If your cPanel provider does not give you a Redis service, use an external Redis provider.
2. S3-compatible storage is required. If your host does not provide MinIO or S3-compatible storage, use an external provider such as Cloudflare R2, Backblaze B2 S3-compatible access, DigitalOcean Spaces, or AWS S3.
3. PostgreSQL is required. This guide assumes you will use cPanel PostgreSQL for the primary database.
4. The browser-backed `whatsapp-web.js` runtime may not be suitable for shared hosting. If Chrome/Chromium is not available on the host, keep the worker on the placeholder or non-browser-compatible backend until you move the worker to a VPS.
5. SSH access is strongly recommended. You can create the Node apps in cPanel UI, but the monorepo install, build, and database migration steps are much easier over SSH.

## Recommended Production Topology

Use separate subdomains for each public service:

- `levan-pms.com` or `app.levan-pms.com` -> customer web
- `admin.levan-pms.com` -> admin web
- `api.levan-pms.com` -> API
- `worker.levan-pms.com` -> worker health endpoint

The worker does not need a public UI. The subdomain is mainly useful for health checks and for cPanel’s Node app management model.

## 1. Prepare Domains in cPanel

Elite Message should use separate hostnames for separate services. That keeps the customer app, admin app, API, and worker from competing for the same virtual host or SSL certificate.

Recommended hostname layout:

- `levan-pms.com` or `app.levan-pms.com` for `customer-web`
- `admin.levan-pms.com` for `admin-web`
- `api.levan-pms.com` for `api`
- `worker.levan-pms.com` for the worker health hostname, if you want one

Use subdomains for the service apps. Do not use aliases or parked domains for the API/admin surfaces unless you intentionally want the same content to answer on multiple hostnames.

1. Decide the canonical customer hostname.
   If the bare domain will be the customer app, make `levan-pms.com` the public customer URL and reserve `www.levan-pms.com` for a redirect to the same site. If you want the marketing site or a future landing page to live on the bare domain, use `app.levan-pms.com` for the customer dashboard instead.

2. Point DNS to the cPanel server before you create the apps.
   At the registrar, update the nameservers or the A records so each hostname resolves to the server IP. If DNS is managed inside cPanel, open `Domains` or `Zone Editor` and confirm that `levan-pms.com`, `app.levan-pms.com`, `admin.levan-pms.com`, `api.levan-pms.com`, and `worker.levan-pms.com` point to the correct address. Official cPanel docs note that domain records are managed from the Domains and Zone Editor interfaces, and that DNS propagation can take time.

3. Create each hostname in cPanel.
   Open `cPanel » Domains » Create a New Domain` or the older `Domains` screen, then add one FQDN at a time:
   - `app.levan-pms.com`
   - `admin.levan-pms.com`
   - `api.levan-pms.com`
   - `worker.levan-pms.com`

   If the customer app uses the bare domain, create `levan-pms.com` as the customer hostname instead of `app.levan-pms.com`.

4. Keep the document root separate.
   Leave the generated document root alone unless your host requires a specific path. The Node.js apps are configured later in `Setup Node.js App`; the domain entry is only what creates the virtual host and hostname binding. Do not point these service hostnames at the same document root unless you deliberately want shared content.

5. Let cPanel create the `www.` variants automatically.
   cPanel will typically create `www` aliases for the domain or subdomain you add. That is useful for the customer site, but you should still treat `admin`, `api`, and `worker` as independent hostnames.

6. Enable SSL after DNS starts resolving.
   Open `SSL/TLS Status` or `AutoSSL`, run a certificate check, and let cPanel issue certificates for each hostname. The cPanel docs note that new domains can be secured automatically and that each virtual host gets its own SSL handling.

7. Verify the final hostnames before moving on.
   Check that these URLs resolve from your browser:
   - `https://levan-pms.com` or `https://app.levan-pms.com`
   - `https://admin.levan-pms.com`
   - `https://api.levan-pms.com/health`
   - `https://worker.levan-pms.com/health` if you created the worker hostname

   If one hostname does not resolve, fix DNS first. If it resolves but HTTPS fails, run AutoSSL again after propagation completes.

## 2. Prepare PostgreSQL in cPanel

Create a PostgreSQL database and a dedicated database user in cPanel.

You will need:

- database name
- username
- password
- host, usually `localhost`
- port, usually `5432`

Because cPanel commonly prefixes PostgreSQL names with the account name, expect values like:

- database: `levanpms_elite_message`
- user: `levanpms_elite_user`

Then construct:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=levanpms_elite_user
POSTGRES_PASSWORD=replace-with-real-password
POSTGRES_DB=levanpms_elite_message
DATABASE_URL=postgresql://levanpms_elite_user:replace-with-real-password@localhost:5432/levanpms_elite_message?schema=public
```

## 3. Provision External Redis and S3-Compatible Storage

This deployment should assume:

- Redis comes from an external managed provider
- object storage comes from an external S3-compatible provider

Minimum required env values:

```env
REDIS_URL=redis://username:password@your-redis-host:6379
REDIS_HOST=your-redis-host
REDIS_PORT=6379

S3_ENDPOINT=https://your-s3-endpoint
S3_PORT=443
S3_ACCESS_KEY=replace-with-real-key
S3_SECRET_KEY=replace-with-real-secret
S3_BUCKET=elite-message-production
S3_REGION=auto
```

These values are required by the shared config schema and API/worker runtime.

## 4. Upload or Clone the Repository

You have two practical options:

1. Use cPanel `Git Version Control` to clone the repository into your home directory.
2. Upload a deployment archive manually and extract it under your home directory.

Recommended location:

```text
/home/levanpms/elite-message
```

Do not deploy the repository inside `public_html`. This is an application repository, not a static site bundle.

## 5. Install Dependencies and Build the Monorepo

Run these commands over SSH from the repository root:

```bash
cd /home/levanpms/elite-message
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile
pnpm build
```

If `corepack` is unavailable on the host, use an equivalent `pnpm` 10.33.x installation method supported by your provider.

Why the root build matters:

- the repo is a workspace monorepo
- the apps depend on shared local packages
- building from individual app directories is not enough

## 6. Create a Production Environment File

Create:

```text
/home/levanpms/elite-message/.env
```

Start from [.env.example](/Volumes/MACOS/EliteMessage/.env.example) and replace local URLs and credentials with production values.

An example production shape:

```env
NODE_ENV=production
LOG_LEVEL=info
ENABLE_EXTERNAL_CONNECTIONS=true

CUSTOMER_WEB_APP_NAME=Elite Message Customer
CUSTOMER_WEB_PORT=3000
CUSTOMER_WEB_PUBLIC_BASE_URL=https://app.levan-pms.com
NEXT_PUBLIC_API_BASE_URL=https://api.levan-pms.com

ADMIN_WEB_APP_NAME=Elite Message Admin
ADMIN_WEB_PORT=3001
ADMIN_WEB_PUBLIC_BASE_URL=https://admin.levan-pms.com

API_APP_NAME=Elite Message API
API_PORT=3002
API_BASE_URL=https://api.levan-pms.com
API_ACCESS_TOKEN_TTL=15m
API_ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
API_REFRESH_TOKEN_TTL=7d
API_COOKIE_DOMAIN=.levan-pms.com
API_COOKIE_SECURE=true
API_CORS_ORIGINS=https://app.levan-pms.com,https://admin.levan-pms.com
API_INTERNAL_TOKEN=replace-with-a-long-random-internal-token
API_GOOGLE_CLIENT_ID=
API_GOOGLE_CLIENT_SECRET=

WORKER_APP_NAME=Elite Message Worker
WORKER_PORT=3003
WORKER_ID=worker-cpanel-1
WORKER_REGION=cpanel
WORKER_MAX_AUTO_ASSIGNMENTS=3
WORKER_SESSION_BACKEND=placeholder
WORKER_SESSION_STORAGE_DIR=/home/levanpms/elite-message/.runtime/worker-sessions
WORKER_WA_HEADLESS=true
WORKER_WA_CAPTURE_SCREENSHOTS=false
WORKER_WA_DOWNLOAD_INBOUND_MEDIA=true
WORKER_WA_STARTUP_TIMEOUT_MS=120000
WORKER_WA_AUTO_RECOVERY_DELAY_MS=5000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=levanpms_elite_user
POSTGRES_PASSWORD=replace-with-real-password
POSTGRES_DB=levanpms_elite_message
DATABASE_URL=postgresql://levanpms_elite_user:replace-with-real-password@localhost:5432/levanpms_elite_message?schema=public

REDIS_URL=redis://username:password@your-redis-host:6379
REDIS_HOST=your-redis-host
REDIS_PORT=6379

S3_ENDPOINT=https://your-s3-endpoint
S3_PORT=443
S3_ACCESS_KEY=replace-with-real-key
S3_SECRET_KEY=replace-with-real-secret
S3_BUCKET=elite-message-production
S3_REGION=auto
```

Notes:

- `NEXT_PUBLIC_API_BASE_URL` must point to the public API URL.
- `API_CORS_ORIGINS` must include the exact customer and admin web origins.
- `API_COOKIE_DOMAIN` should normally be the shared parent domain such as `.levan-pms.com`.
- Keep secrets long and random.

## 7. Run Database Migrations

After the production `.env` file exists, run:

```bash
cd /home/levanpms/elite-message
pnpm --filter @elite-message/db db:migrate
```

If you also want the development bootstrap accounts in a staging environment, run:

```bash
pnpm db:seed
```

Do not run the development seed on a real production environment unless you explicitly want those accounts and records.

## 8. Create Node.js Apps in cPanel

Use `Setup Node.js App` four times.

### Customer web

- Node.js version: `20` or `22`
- application mode: `Production`
- application root: `/home/levanpms/elite-message/apps/customer-web`
- application URL: `app.levan-pms.com`
- application startup file: `cpanel-app.js`

### Admin web

- Node.js version: `20` or `22`
- application mode: `Production`
- application root: `/home/levanpms/elite-message/apps/admin-web`
- application URL: `admin.levan-pms.com`
- application startup file: `cpanel-app.js`

### API

- Node.js version: `20` or `22`
- application mode: `Production`
- application root: `/home/levanpms/elite-message/apps/api`
- application URL: `api.levan-pms.com`
- application startup file: `cpanel-app.js`

### Worker

- Node.js version: `20` or `22`
- application mode: `Production`
- application root: `/home/levanpms/elite-message/apps/worker`
- application URL: `worker.levan-pms.com`
- application startup file: `cpanel-app.js`

## 9. Apply Environment Variables in cPanel

In each Node.js app entry, set the environment variables required by that service.

You can either:

1. rely on the repository-root `.env` file if your host leaves it readable to the app processes, or
2. enter the same variables directly in each cPanel Node app configuration

The safer cPanel approach is to set them explicitly in each app configuration.

### Minimum variables for customer web

- `NODE_ENV`
- `LOG_LEVEL`
- `ENABLE_EXTERNAL_CONNECTIONS`
- `CUSTOMER_WEB_APP_NAME`
- `CUSTOMER_WEB_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

### Minimum variables for admin web

- `NODE_ENV`
- `LOG_LEVEL`
- `ENABLE_EXTERNAL_CONNECTIONS`
- `ADMIN_WEB_APP_NAME`
- `ADMIN_WEB_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

### Minimum variables for API

- everything listed in the API section of the production example above
- especially PostgreSQL, Redis, S3, token, cookie, and CORS variables

### Minimum variables for worker

- `NODE_ENV`
- `LOG_LEVEL`
- `ENABLE_EXTERNAL_CONNECTIONS`
- `API_BASE_URL`
- `API_INTERNAL_TOKEN`
- `WORKER_ID`
- `WORKER_REGION`
- `WORKER_MAX_AUTO_ASSIGNMENTS`
- `WORKER_SESSION_BACKEND`
- `WORKER_SESSION_STORAGE_DIR`
- Redis variables
- PostgreSQL variables if the selected worker runtime needs them
- S3 variables if the selected worker runtime needs them

## 10. Restart Services in the Correct Order

After configuration or a new deployment, restart in this order:

1. `api`
2. `worker`
3. `customer-web`
4. `admin-web`

This keeps the public surfaces from booting before the API is available.

## 11. Verify the Deployment

After the apps are running, verify:

- customer web: `https://app.levan-pms.com`
- admin web: `https://admin.levan-pms.com`
- API health: `https://api.levan-pms.com/health`
- worker health: `https://worker.levan-pms.com/health`

Expected result:

- customer/admin URLs return the site
- API `/health` returns `200`
- worker `/health` returns `200`

The API root `/` may still return `404`. That is normal for this repository.

## 12. Updating the Deployment

When you push a new version:

```bash
cd /home/levanpms/elite-message
git pull
pnpm install --frozen-lockfile
pnpm build
pnpm --filter @elite-message/db db:migrate
```

Then restart the four Node apps from cPanel.

## 13. Cron Jobs

This repository does not currently require a production cron job just to keep the app alive if cPanel keeps Node apps running correctly.

Use `Cron Jobs` only if:

- your provider kills idle worker processes unexpectedly
- you need a watchdog that checks and restarts services through provider-supported commands

Do not use cron as the primary process manager if the Node.js app feature is already available.

## 14. Known Risks on Shared cPanel

Even with Node support, shared cPanel still has limits:

- memory ceilings may be tight for four Node services
- background worker reliability depends on the host
- browser-backed `whatsapp-web.js` is often unsuitable on shared hosting
- Redis and S3 almost always need to be external
- monorepo installs and builds are heavier than a single-app deployment

If any of these become unstable, move the API and worker to a VPS first and keep only the web apps on cPanel.

## 15. Recommended Fallback Architecture

If the full four-service deployment proves too heavy for this cPanel account, the next best split is:

- keep `customer-web` and `admin-web` on cPanel
- move `api` and `worker` to a VPS
- keep PostgreSQL, Redis, and S3 on managed services or the VPS

In that setup:

- `NEXT_PUBLIC_API_BASE_URL` points from cPanel-hosted Next apps to the VPS-hosted API
- the worker runs where background processes are more reliable
- your public marketing and dashboard surfaces can still live on cPanel
