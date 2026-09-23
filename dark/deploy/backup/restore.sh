#!/bin/sh
# Odtwarzanie: restore.sh <plik.dump | s3-key | latest> <TARGET_DATABASE_URL>
#   latest   -> najnowszy obiekt z R2 (R2_BUCKET/BACKUP_PREFIX)
#   s3-key   -> klucz w R2, np. staging/backup-20260101T030000Z.dump
#   plik     -> lokalna ścieżka
set -eu
src="${1:?podaj plik, klucz s3 albo 'latest'}"
target="${2:?podaj docelowy DATABASE_URL}"

if [ -f "$src" ]; then
  file="$src"
else
  : "${R2_BUCKET:?R2_BUCKET wymagany dla odtwarzania z R2}"
  if [ "$src" = "latest" ]; then
    src=$(aws s3 ls "s3://$R2_BUCKET/${BACKUP_PREFIX:-backups}/" --endpoint-url "$R2_ENDPOINT" \
      | awk '{print $4}' | sort | tail -n 1)
    src="${BACKUP_PREFIX:-backups}/$src"
  fi
  file="/tmp/restore.dump"
  aws s3 cp "s3://$R2_BUCKET/$src" "$file" --endpoint-url "$R2_ENDPOINT" --only-show-errors
fi

pg_restore --clean --if-exists --no-owner --no-privileges --exit-on-error --dbname="$target" "$file"
echo "restore: OK $src -> $(echo "$target" | sed 's#//[^@]*@#//***@#')"
