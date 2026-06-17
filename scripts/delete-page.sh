#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGE_NAME="$1"

usage() {
  echo "Usage: $0 <page-name>"
  echo "Exemple: $0 matchs"
  exit 1
}

if [[ -z "${PAGE_NAME:-}" ]]; then
  usage
fi

PAGE_FILE="$ROOT_DIR/assets/js/pages/${PAGE_NAME}.js"
CSS_FILE="$ROOT_DIR/assets/css/${PAGE_NAME}.css"
ROUTER_FILE="$ROOT_DIR/assets/js/router.js"
INDEX_FILE="$ROOT_DIR/index.html"

if [[ ! -f "$PAGE_FILE" && ! -f "$CSS_FILE" ]]; then
  echo "Aucune page trouvée pour : $PAGE_NAME"
  exit 1
fi

read -r -p "Supprimer la page '$PAGE_NAME' ? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Annulé."
  exit 0
fi

rm -f "$PAGE_FILE" "$CSS_FILE"

TMP_ROUTER="$(mktemp)"
awk -v page="$PAGE_NAME" '
  $0 ~ "import .*pages/" page ".js" { next }
  $0 ~ "^[[:space:]]*" page ": .*,$" { next }
  { print }
' "$ROUTER_FILE" > "$TMP_ROUTER"
mv "$TMP_ROUTER" "$ROUTER_FILE"

TMP_INDEX="$(mktemp)"
awk -v css="assets/css/${PAGE_NAME}.css" '
  index($0, "href=\"" css "\"") { next }
  { print }
' "$INDEX_FILE" > "$TMP_INDEX"
mv "$TMP_INDEX" "$INDEX_FILE"

echo "Page supprimée : $PAGE_NAME"
echo "Fichiers supprimés :"
echo " - $PAGE_FILE"
echo " - $CSS_FILE"
echo "Router, sidebar et index.html nettoyés automatiquement."
