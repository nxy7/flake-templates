#!/usr/bin/env bash
# Test backupu: migracje + dane -> backup.sh -> restore.sh do ŚWIEŻEJ bazy -> porównanie danych.
# Wymaga: pg_dump/pg_restore/psql (devShell), ADMIN_DATABASE_URL do serwera Postgres
# (CI: service container; lokalnie np. docker run -p 55432:5432 -e POSTGRES_PASSWORD=pg postgres:17-alpine).
set -euo pipefail
ADMIN="${ADMIN_DATABASE_URL:-${DATABASE_URL:?ustaw ADMIN_DATABASE_URL (postgres://...)}}"
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
SRC_NAME="backup_src_$$"; DST_NAME="backup_dst_$$"
SRC="${ADMIN%/*}/$SRC_NAME"; DST="${ADMIN%/*}/$DST_NAME"
tmp="$(mktemp -d)"
cleanup() {
  psql "$ADMIN" -qc "drop database if exists $SRC_NAME with (force)" -c "drop database if exists $DST_NAME with (force)" >/dev/null
  rm -rf "$tmp"
}
trap cleanup EXIT

psql "$ADMIN" -qc "create database $SRC_NAME" -c "create database $DST_NAME"
DATABASE_URL="$SRC" bun "$root/packages/db/src/migrate-cli.ts"
psql "$SRC" -q <<'SQL'
insert into "user"(id, name, email) values ('u1', 'Backup Test', 'backup@example.test');
insert into notes(user_id, title, body) values ('u1', 'Notatka z backupu', 'zażółć gęślą jaźń');
SQL

DATABASE_URL="$SRC" BACKUP_LOCAL_DIR="$tmp" sh "$here/backup.sh"
dump="$(ls "$tmp"/backup-*.dump | head -n 1)"
sh "$here/restore.sh" "$dump" "$DST"

q='select u.email, n.title, n.body from notes n join "user" u on u.id = n.user_id order by n.title'
expected="$(psql "$SRC" -Atc "$q")"
actual="$(psql "$DST" -Atc "$q")"
migrations="$(psql "$DST" -Atc 'select count(*) from drizzle.__drizzle_migrations')"
if [[ "$expected" != "$actual" || -z "$actual" ]]; then
  echo "backup-test: BŁĄD — dane po odtworzeniu różnią się" >&2
  echo "oczekiwane: $expected" >&2; echo "otrzymane:  $actual" >&2
  exit 1
fi
echo "backup-test: OK — odtworzono '$actual', migracje w bazie docelowej: $migrations"
