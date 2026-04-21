#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_PATH="$ROOT_DIR/prisma/schema.prisma"

DATABASE_HOST="${DATABASE_HOST:-localhost}"
DATABASE_PORT="${DATABASE_PORT:-3306}"
DATABASE_USER="${DATABASE_USER:?DATABASE_USER is required}"
DATABASE_PASSWORD="${DATABASE_PASSWORD:?DATABASE_PASSWORD is required}"
DATABASE_NAME="${DATABASE_NAME:?DATABASE_NAME is required}"
DATABASE_URL="${DATABASE_URL:?DATABASE_URL is required}"

table_count="$(
  mysql \
    --protocol TCP \
    --host "$DATABASE_HOST" \
    --port "$DATABASE_PORT" \
    --user "$DATABASE_USER" \
    --password="$DATABASE_PASSWORD" \
    --skip-column-names \
    --batch \
    "$DATABASE_NAME" \
    --execute "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE();" \
)"

if [[ "$table_count" != "0" ]]; then
  echo "Database is not empty. bootstrap-plain-mysql.sh only supports a fresh database." >&2
  exit 1
fi

prisma db push --schema "$SCHEMA_PATH" --accept-data-loss
