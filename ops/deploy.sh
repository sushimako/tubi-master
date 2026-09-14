#!/usr/bin/env bash
# Deploy to a remote host over SSH: sync the code, install dependencies with uv and
# (re)start the systemd service. Needs ssh + rsync locally and sudo on the host.
#
#   DEPLOY_HOST=myvm.exe.xyz ops/deploy.sh
#
# Optional: DEPLOY_DIR (relative to the remote home, default tubi-master),
# DEPLOY_SERVICE (default curriculum), DEPLOY_PORT (default 8000).
# The database and secret key in <DEPLOY_DIR>/instance on the host are never touched.
set -euo pipefail

HOST="${DEPLOY_HOST:?Set DEPLOY_HOST to the SSH host, e.g. DEPLOY_HOST=myvm.exe.xyz}"
APP_DIR="${DEPLOY_DIR:-tubi-master}"
SERVICE="${DEPLOY_SERVICE:-curriculum}"
PORT="${DEPLOY_PORT:-8000}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Syncing code to $HOST:~/$APP_DIR"
ssh "$HOST" "mkdir -p ~/$APP_DIR"
# Excluded paths are left alone on the host, even with --delete.
rsync -az --delete \
  --exclude .git/ --exclude .venv/ --exclude instance/ --exclude __pycache__/ \
  --exclude .mypy_cache/ --exclude scripts/.cache/ --exclude ops/backups/ --exclude .DS_Store \
  "$ROOT/" "$HOST:$APP_DIR/"

echo "==> Installing dependencies and restarting $SERVICE"
ssh "$HOST" "bash -s -- '$APP_DIR' '$SERVICE' '$PORT'" <<'REMOTE'
set -euo pipefail
APP_DIR="$HOME/$1" SERVICE="$2" PORT="$3"
export PATH="$HOME/.local/bin:$PATH"

if ! command -v uv >/dev/null; then
  echo "Installing uv"
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

cd "$APP_DIR"
uv sync --frozen --no-dev

sed -e "s|@USER@|$(id -un)|g" -e "s|@APP_DIR@|$APP_DIR|g" -e "s|@PORT@|$PORT|g" ops/tubi-master.service \
  | sudo tee "/etc/systemd/system/$SERVICE.service" >/dev/null
sudo systemctl daemon-reload
sudo systemctl enable --quiet "$SERVICE"
sudo systemctl restart "$SERVICE"

for _ in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then
    echo "==> $SERVICE is up on port $PORT"
    exit 0
  fi
  sleep 1
done
echo "==> $SERVICE did not answer on port $PORT" >&2
sudo journalctl -u "$SERVICE" -n 40 --no-pager >&2
exit 1
REMOTE
