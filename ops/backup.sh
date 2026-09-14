#!/usr/bin/env bash
# Copy the production database and secret key to ops/backups/<timestamp>/ (ignored by git).
# Both are needed: without the key, the passcodes stored in the database no longer work.
#
#   DEPLOY_HOST=myvm.exe.xyz ops/backup.sh
set -euo pipefail

HOST="${DEPLOY_HOST:?Set DEPLOY_HOST to the SSH host, e.g. DEPLOY_HOST=myvm.exe.xyz}"
APP_DIR="${DEPLOY_DIR:-tubi-master}"
DEST="$(cd "$(dirname "$0")" && pwd)/backups/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$DEST"
# SQLite's backup API gives a consistent copy even while the app is writing.
ssh "$HOST" "cd ~/$APP_DIR/instance && ../.venv/bin/python -c \"import sqlite3; source = sqlite3.connect('tubi.sqlite3'); target = sqlite3.connect('backup.sqlite3'); source.backup(target); target.close()\""
scp -q "$HOST:$APP_DIR/instance/backup.sqlite3" "$DEST/tubi.sqlite3"
scp -q "$HOST:$APP_DIR/instance/secret.key" "$DEST/secret.key"
ssh "$HOST" "rm ~/$APP_DIR/instance/backup.sqlite3"
chmod 600 "$DEST/secret.key"
echo "Backup written to $DEST"
