#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGE_NAME="$1"
PAGE_LABEL="$2"
PAGE_ICON="${3:-fa-solid fa-circle}"
INSERT_AFTER="${4:-parametres}"

usage() {
  echo "Usage: $0 <page-name> <label> [fontawesome-icon] [insert-after]"
  echo "Exemple: $0 matchs \"MATCHS\" \"fa-solid fa-basketball\" dashboard"
  exit 1
}

if [[ -z "${PAGE_NAME:-}" || -z "${PAGE_LABEL:-}" ]]; then
  usage
fi

if [[ ! "$PAGE_NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Erreur : page-name doit contenir uniquement minuscules, chiffres et tirets."
  exit 1
fi

PAGE_FILE="$ROOT_DIR/assets/js/pages/${PAGE_NAME}.js"
CSS_FILE="$ROOT_DIR/assets/css/${PAGE_NAME}.css"
ROUTER_FILE="$ROOT_DIR/assets/js/router.js"
INDEX_FILE="$ROOT_DIR/index.html"

if [[ -f "$PAGE_FILE" ]]; then
  echo "La page existe déjà : $PAGE_FILE"
  exit 1
fi

cat > "$PAGE_FILE" <<EOF
export function ${PAGE_NAME//-/_}Page() {
  return \`
<section class="app-view dashboard-page ${PAGE_NAME}-page" data-view="${PAGE_NAME}" aria-label="${PAGE_LABEL}">
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <div class="dashboard-brand">
        <div class="logo-slot" aria-label="Logo High Five">
          <img src="assets/images/logo.png" alt="Logo High Five">
        </div>
        <div class="dashboard-brand-copy">
          <h2>HIGH FIVE</h2>
          <p>Saison 2026</p>
        </div>
      </div>

      <nav class="dashboard-nav">
        <a href="#" class="dashboard-nav-item" data-show-view="dashboard">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-table-cells"></i></span>
          TABLEAU DE BORD
        </a>
        <a href="#" class="dashboard-nav-item" data-show-view="equipe">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-users"></i></span>
          ÉQUIPES
        </a>
        <a href="#" class="dashboard-nav-item" data-show-view="calendrier">
          <span class="nav-icon" aria-hidden="true"><i class="fa-regular fa-calendar"></i></span>
          CALENDRIER
        </a>
        <a href="#" class="dashboard-nav-item" data-show-view="parametres">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-gear"></i></span>
          PARAMÈTRES
        </a>
        <a href="#" class="dashboard-nav-item" data-show-view="profil">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          PROFIL
        </a>
        <a href="#" class="dashboard-nav-item is-active" data-show-view="${PAGE_NAME}">
          <span class="nav-icon" aria-hidden="true"><i class="${PAGE_ICON}"></i></span>
          ${PAGE_LABEL}
        </a>
      </nav>

      <button class="dashboard-logout" data-show-view="login">DÉCONNEXION</button>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-topbar">
        <div class="dashboard-topbar-title">HIGH FIVE</div>
        <div class="dashboard-topbar-actions">
          <button class="topbar-action topbar-action--search" aria-label="Rechercher"></button>
          <button class="topbar-action topbar-action--bell" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 01-3.46 0"></path>
            </svg>
          </button>
          <img src="assets/images/kv.png" alt="Profil Utilisateur" class="dashboard-avatar" />
        </div>
      </header>

      <div class="dashboard-content">
        <section class="dashboard-panel">
          <div class="dashboard-panel-header">
            <h2>${PAGE_LABEL}</h2>
          </div>
          <p>Page créée automatiquement.</p>
        </section>
      </div>
    </main>
  </div>
</section>
\`;
}
EOF

cat > "$CSS_FILE" <<EOF
.${PAGE_NAME}-page .dashboard-content {
  min-height: 100%;
}

.${PAGE_NAME}-page .dashboard-panel {
  min-height: 420px;
}
EOF

if ! grep -q "import { .*${PAGE_NAME//-/_}Page" "$ROUTER_FILE"; then
  TMP_ROUTER="$(mktemp)"
  awk -v page="$PAGE_NAME" -v fn="${PAGE_NAME//-/_}Page" '
    BEGIN { inserted = 0 }
    !inserted && /^import \{/ {
      print
      print "import { " fn " } from \"./pages/" page ".js\";"
      inserted = 1
      next
    }
    { print }
  ' "$ROUTER_FILE" > "$TMP_ROUTER"
  mv "$TMP_ROUTER" "$ROUTER_FILE"
fi

if ! grep -q "[[:space:]]*${PAGE_NAME}: ${PAGE_NAME//-/_}Page," "$ROUTER_FILE"; then
  TMP_ROUTER="$(mktemp)"
  awk -v page="$PAGE_NAME" -v fn="${PAGE_NAME//-/_}Page" -v insert_after="$INSERT_AFTER" '
    BEGIN { inserted = 0 }
    !inserted && $0 ~ "^[[:space:]]*" insert_after ": .*,$" {
      print
      print "  " page ": " fn ","
      inserted = 1
      next
    }
    { print }
  ' "$ROUTER_FILE" > "$TMP_ROUTER"
  mv "$TMP_ROUTER" "$ROUTER_FILE"
fi

if ! grep -q "href=\"assets/css/${PAGE_NAME}.css\"" "$INDEX_FILE"; then
  TMP_INDEX="$(mktemp)"
  awk -v css="assets/css/${PAGE_NAME}.css" '
    { print }
    /<\/head>/ {
      print "    <link rel=\"stylesheet\" href=\"" css "\">"
    }
  ' "$INDEX_FILE" > "$TMP_INDEX"
  mv "$TMP_INDEX" "$INDEX_FILE"
fi

echo "Page créée : $PAGE_NAME"
echo "Fichiers générés :"
echo " - $PAGE_FILE"
echo " - $CSS_FILE"
echo "Router et sidebar mis à jour automatiquement."
