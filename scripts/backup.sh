#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${1:-$ROOT_DIR/backups}"
DATE="$(date +%Y-%m-%d_%H-%M-%S)"
ARCHIVE_NAME="backup-high-five-${DATE}.tar.gz"
ARCHIVE_PATH="$BACKUP_DIR/$ARCHIVE_NAME"

mkdir -p "$BACKUP_DIR"

tar \
  --exclude="$ROOT_DIR/node_modules" \
  --exclude="$ROOT_DIR/.git" \
  --exclude="$BACKUP_DIR" \
  -czf "$ARCHIVE_PATH" \
  -C "$ROOT_DIR" \
  .

echo "Backup créé : $ARCHIVE_PATH"
