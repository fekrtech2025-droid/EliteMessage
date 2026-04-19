#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS_DIR="$ROOT_DIR/prisma/migrations"

POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:?POSTGRES_USER is required}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"
POSTGRES_DB="${POSTGRES_DB:?POSTGRES_DB is required}"

export PGPASSWORD="$POSTGRES_PASSWORD"

table_count="$(
  psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
)"

if [[ "$table_count" != "0" ]]; then
  echo "Database is not empty. bootstrap-plain-postgres.sh only supports a fresh database." >&2
  exit 1
fi

tmp_sql="$(mktemp)"
trap 'rm -f "$tmp_sql"' EXIT

declare -a migration_dirs=(
  "20260408234721_phase1a_core_auth"
  "20260409002434_phase1b_instance_ops"
  "20260409011459_phase2a_runtime_actions"
  "20260409025152_phase2b_outbound_messages"
  "20260409033024_phase3a_whatsapp_runtime"
  "20260409161500_audit_logs_module"
  "20260409171500_instance_takeover_action"
  "20260409193000_phase5_admin_support"
  "20260409213000_phase6_hardening_foundation"
  "20260413000000_account_theme_preference"
  "20260414000000_default_light_theme"
)

for dir in "${migration_dirs[@]}"; do
  sed \
    -e 's/\<CITEXT\>/TEXT/g' \
    -e 's/ DEFAULT gen_random_uuid()//g' \
    -e "s/encode(gen_random_bytes(32), 'hex')/md5(random()::text || clock_timestamp()::text)/g" \
    "$MIGRATIONS_DIR/$dir/migration.sql" >>"$tmp_sql"
  printf '\n' >>"$tmp_sql"
done

psql -v ON_ERROR_STOP=1 -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$tmp_sql"
