#!/usr/bin/env bash
set -euo pipefail
umask 077
[ "$#" -eq 1 ] || { echo 'Usage: scripts/restore.sh <backup.sqlite3>' >&2; exit 1; }
command -v sqlite3 >/dev/null || { echo 'Error: host sqlite3 CLI is required.' >&2; exit 1; }
BACKUP_FILE=$(realpath -e -- "$1")
[ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ] || { echo 'Error: backup must be a nonempty regular file.' >&2; exit 1; }
INTEGRITY=$(sqlite3 -readonly "$BACKUP_FILE" 'PRAGMA integrity_check;')
[ "$INTEGRITY" = ok ] || { echo 'Error: input integrity failed.' >&2; exit 1; }
SCHEMA_SQL="SELECT id,email,role FROM users LIMIT 1; SELECT id,storeName FROM business_settings LIMIT 1; SELECT id FROM orders LIMIT 1;"
sqlite3 -readonly "$BACKUP_FILE" "$SCHEMA_SQL" >/dev/null
UUID=$(cat /proc/sys/kernel/random/uuid)
TEST_VOL="2crown_restore_$UUID"
TEMP_CONTAINER="2crown_restore_$UUID"
SUCCESS=0
CREATED_VOL=0
CREATED_CONTAINER=0
cleanup() {
  if [ "$CREATED_CONTAINER" -eq 1 ] && [ "$(docker inspect -f '{{ index .Config.Labels "2crown.restore.id" }}' "$TEMP_CONTAINER" 2>/dev/null || true)" = "$UUID" ]; then
    docker rm -f "$TEMP_CONTAINER" >/dev/null 2>&1 || true
  fi
  if [ "$SUCCESS" -eq 0 ] && [ "$CREATED_VOL" -eq 1 ] && [ "$(docker volume inspect -f '{{ index .Labels "2crown.restore.id" }}' "$TEST_VOL" 2>/dev/null || true)" = "$UUID" ]; then
    docker volume rm "$TEST_VOL" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT
if docker volume inspect "$TEST_VOL" >/dev/null 2>&1 || docker inspect "$TEMP_CONTAINER" >/dev/null 2>&1; then
  echo 'Error: restore resource collision.' >&2; exit 1
fi
DB_CONTAINER=$(docker compose ps --status running -q app)
[ -n "$DB_CONTAINER" ] && [ "$(printf '%s\n' "$DB_CONTAINER" | wc -l)" -eq 1 ] || { echo 'Error: exactly one running Compose app is required.' >&2; exit 1; }
APP_IMAGE=$(docker inspect -f '{{.Image}}' "$DB_CONTAINER")
docker volume create --label "2crown.restore.id=$UUID" "$TEST_VOL" >/dev/null
[ "$(docker volume inspect -f '{{ index .Labels "2crown.restore.id" }}' "$TEST_VOL")" = "$UUID" ] || { echo 'Error: volume ownership mismatch.' >&2; exit 1; }
CREATED_VOL=1
docker run -d --name "$TEMP_CONTAINER" --label "2crown.restore.id=$UUID" -v "$TEST_VOL:/data" "$APP_IMAGE" sleep 3600 >/dev/null
CREATED_CONTAINER=1
[ "$(docker inspect -f '{{ index .Config.Labels "2crown.restore.id" }}' "$TEMP_CONTAINER")" = "$UUID" ] || { echo 'Error: container ownership mismatch.' >&2; exit 1; }
# Stream from an opened host file; Docker never parses unusual host filenames.
docker exec -i -u root "$TEMP_CONTAINER" sh -c 'cat > /data/prod.sqlite3 && chown node:node /data/prod.sqlite3' < "$BACKUP_FILE"
INTEGRITY=$(docker exec "$TEMP_CONTAINER" sqlite3 -readonly /data/prod.sqlite3 'PRAGMA integrity_check;')
[ "$INTEGRITY" = ok ] || { echo 'Error: restored integrity failed.' >&2; exit 1; }
docker exec "$TEMP_CONTAINER" sqlite3 -readonly /data/prod.sqlite3 "$SCHEMA_SQL" >/dev/null
SUCCESS=1
echo "Validated isolated volume: $TEST_VOL"
echo "Ownership label: 2crown.restore.id=$UUID"
echo "Cleanup command: docker volume rm $TEST_VOL"
