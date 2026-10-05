#!/usr/bin/env bash
set -euo pipefail
umask 077
command -v sqlite3 >/dev/null || { echo 'Error: host sqlite3 CLI is required.' >&2; exit 1; }
command -v docker >/dev/null || { echo 'Error: Docker is required.' >&2; exit 1; }
UUID=$(cat /proc/sys/kernel/random/uuid)
BACKUP_DIR=${BACKUP_DIR:-/tmp/2crown_backups}
mkdir -p -- "$BACKUP_DIR"
BACKUP_DIR=$(realpath -- "$BACKUP_DIR")
chmod 700 "$BACKUP_DIR"
TEMP_HOST_BACKUP=$(mktemp "$BACKUP_DIR/.2crown-$UUID-XXXXXX")
CONTAINER_TEMP="/tmp/2crown-backup-$UUID.sqlite3"
DB_CONTAINER=''
cleanup() {
  rm -f -- "$TEMP_HOST_BACKUP" "$TEMP_HOST_BACKUP-wal" "$TEMP_HOST_BACKUP-shm"
  if [ -n "$DB_CONTAINER" ]; then docker exec "$DB_CONTAINER" rm -f -- "$CONTAINER_TEMP" >/dev/null 2>&1 || true; fi
}
trap cleanup EXIT
DB_CONTAINER=$(docker compose ps --status running -q app)
[ -n "$DB_CONTAINER" ] && [ "$(printf '%s\n' "$DB_CONTAINER" | wc -l)" -eq 1 ] || { echo 'Error: exactly one running Compose app is required.' >&2; exit 1; }
DB_PATH=/data/prod.sqlite3
SCHEMA_SQL="SELECT id,email,role FROM users LIMIT 1; SELECT id,storeName FROM business_settings LIMIT 1; SELECT id FROM orders LIMIT 1;"
docker exec "$DB_CONTAINER" test -s "$DB_PATH"
docker exec "$DB_CONTAINER" sqlite3 -readonly "$DB_PATH" "$SCHEMA_SQL" >/dev/null
docker exec "$DB_CONTAINER" sqlite3 "$DB_PATH" ".backup '$CONTAINER_TEMP'"
docker exec "$DB_CONTAINER" test -s "$CONTAINER_TEMP"
docker cp "$DB_CONTAINER:$CONTAINER_TEMP" "$TEMP_HOST_BACKUP"
[ -s "$TEMP_HOST_BACKUP" ]
chmod 600 "$TEMP_HOST_BACKUP"
# The detached backup must not create WAL sidecars during read-only validation.
sqlite3 "$TEMP_HOST_BACKUP" 'PRAGMA journal_mode=DELETE;' >/dev/null
INTEGRITY=$(sqlite3 -readonly "$TEMP_HOST_BACKUP" 'PRAGMA integrity_check;')
[ "$INTEGRITY" = ok ] || { echo 'Error: backup integrity failed.' >&2; exit 1; }
sqlite3 -readonly "$TEMP_HOST_BACKUP" "$SCHEMA_SQL" >/dev/null
# Hard-link publication is atomic and never overwrites an existing destination.
for attempt in 1 2 3; do
  FINAL_BACKUP_FILE="$BACKUP_DIR/prod_$(date +%Y%m%d_%H%M%S)_$(cat /proc/sys/kernel/random/uuid).sqlite3"
  if ln -- "$TEMP_HOST_BACKUP" "$FINAL_BACKUP_FILE"; then
    echo "Backup completed successfully: $FINAL_BACKUP_FILE"
    exit 0
  fi
done
echo 'Error: could not publish backup without overwriting.' >&2
exit 1
