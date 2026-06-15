import { getCurrentUser } from "../auth.js";
import { getTeamDraft, saveTeamDraft, showToast } from "../user-data.js";

const MIN_ROSTER = 5;
const MAX_ROSTER = 12;

const PLAYER_POOL = [
  { id: "daiki", firstName: "Daiki", lastName: "Aomine", position: "PG", height: "6'2\"", weight: "185 LBS", image: "assets/images/players/daiki.png" },
  { id: "tyler", firstName: "Tyler", lastName: "Vance", position: "SF", height: "6'7\"", weight: "228 LBS", image: "assets/images/players/tyler.png" },
  { id: "david", firstName: "David", lastName: "Chen", position: "C", height: "6'11\"", weight: "250 LBS", image: "assets/images/players/david.png" },
  { id: "marcus", firstName: "Marcus", lastName: "Reed", position: "SG", height: "6'4\"", weight: "195 LBS", image: "assets/images/players/tyler.png" },
  { id: "elena", firstName: "Elena", lastName: "Brooks", position: "PF", height: "6'0\"", weight: "170 LBS", image: "assets/images/players/daiki.png" },
  { id: "jay", firstName: "Jay", lastName: "Morales", position: "PG", height: "6'1\"", weight: "180 LBS", image: "assets/images/players/david.png" }
];

const DEFAULT_DRAFT = {
  name: "BASKUP",
  emblemUrl: "assets/images/logo.png",
  rosterIds: [],
  deployedSnapshot: null
};

function cloneDraft(draft) {
  return {
    ...draft,
    rosterIds: [...draft.rosterIds]
  };
}

function getDefaultDraft() {
  return cloneDraft(DEFAULT_DRAFT);
}

function loadDraft(userId) {
  const stored = getTeamDraft(userId);
  if (!stored) return getDefaultDraft();

  return {
    ...getDefaultDraft(),
    ...stored,
    rosterIds: Array.isArray(stored.rosterIds) ? [...stored.rosterIds] : [...DEFAULT_DRAFT.rosterIds]
  };
}

function getPlayerById(id) {
  return PLAYER_POOL.find((player) => player.id === id);
}

function renderPlayerCard(player) {
  return `
    <div class="player-card" data-player-id="${player.id}">
      <div class="player-card-photo-left">
        <img src="${player.image}" alt="${player.firstName} ${player.lastName}" class="player-card-image" />
      </div>
      <div class="player-card-bg-right">
        <span class="player-position">${player.position}</span>
        <div class="player-name">${player.firstName.toUpperCase()}<br>${player.lastName.toUpperCase()}</div>
        <div class="player-stats">${player.height} · ${player.weight}</div>
      </div>
      <button type="button" class="player-card-close" aria-label="Retirer ${player.firstName} ${player.lastName}">✕</button>
    </div>
  `;
}

function renderDraftModalOptions(rosterIds) {
  const available = PLAYER_POOL.filter((player) => !rosterIds.includes(player.id));

  if (!available.length) {
    return `<p class="team-feedback">Tous les joueurs disponibles sont déjà dans l'effectif.</p>`;
  }

  return available.map((player) => `
    <button type="button" class="app-modal-option" data-draft-player="${player.id}">
      <img src="${player.image}" alt="" />
      <span class="app-modal-option-copy">
        <strong>${player.firstName} ${player.lastName}</strong>
        <span>${player.position} · ${player.height}</span>
      </span>
    </button>
  `).join("");
}

function renderTeamMarkup(draft) {
  const rosterPlayers = draft.rosterIds.map(getPlayerById).filter(Boolean);
  const rosterCards = rosterPlayers.map(renderPlayerCard).join("");
  const canAddMore = draft.rosterIds.length < MAX_ROSTER;
  const emblemPreview = draft.emblemUrl
    ? `<img src="${draft.emblemUrl}" alt="Emblème" class="dashboard-upload-preview" />`
    : "";

  return `
<section class="app-view dashboard-page team-page" data-view="equipe" aria-label="Équipe High Five">
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
        <a href="#" class="dashboard-nav-item is-active" data-show-view="equipe">
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

      <div class="team-content">
        <div class="team-page-header">
          <div class="team-page-header-left">
            <div class="dashboard-kicker">SALLE DE DRAFT ACTIVE</div>
            <div class="dashboard-page-title">CRÉATEUR DE FRANCHISE</div>
          </div>
          <div class="team-page-header-actions">
            <button type="button" class="dashboard-btn-cancel" data-team-action="cancel"><span>ANNULER</span></button>
            <button type="button" class="dashboard-btn-deploy" data-team-action="deploy"><span>DÉPLOYER L'EFFECTIF</span></button>
          </div>
        </div>

        <div class="team-body">
          <div class="team-left">
            <div class="dashboard-panel-identity">
              <div class="dashboard-section-title">IDENTITÉ</div>
              <hr class="dashboard-section-divider" />

              <div class="dashboard-label-text">DÉSIGNATION DE L'ÉQUIPE</div>
              <div class="dashboard-input-teamname">
                <input type="text" id="team-name-input" value="${draft.name}" maxlength="24" aria-label="Nom de l'équipe" />
              </div>

              <div class="dashboard-emblem-label">EMBLÈME DE LA FRANCHISE</div>
              <label class="dashboard-upload${draft.emblemUrl ? " has-preview" : ""}">
                ${emblemPreview}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div class="upload-label">TÉLÉCHARGER L'EMBLÈME</div>
                <div class="upload-sub">SVG, PNG, JPG (MAX 5MO)</div>
                <input type="file" id="team-emblem-input" accept="image/png,image/jpeg,image/svg+xml" />
              </label>
            </div>

            <div class="requirements-box">
              <div class="requirements-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-color); flex-shrink:0;" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Exigences de l'Effectif</span>
              </div>
              <p class="requirements-text">
                Un effectif de tournoi valide nécessite un minimum de ${MIN_ROSTER} joueurs actifs et un maximum de ${MAX_ROSTER}.
                Assurez-vous que toutes les positions sont correctement couvertes avant le déploiement.
              </p>
              <p class="team-feedback" id="team-feedback" aria-live="polite"></p>
            </div>
          </div>

          <div class="team-right">
            <div class="roster-header">
              <div class="roster-header-left">
                <span class="dashboard-roster-title">EFFECTIF ACTIF</span>
                <span class="dashboard-roster-count" id="team-roster-count">${draft.rosterIds.length} / ${MAX_ROSTER} PLACES</span>
              </div>
              <button type="button" class="dashboard-btn-draft-player" data-team-action="open-draft"${canAddMore ? "" : " disabled"}>
                <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
                <span>DRAFTER UN JOUEUR</span>
              </button>
            </div>

            <div class="players-grid" id="team-roster-grid">
              ${rosterCards}
              ${canAddMore ? `<button type="button" class="add-player-card" data-team-action="open-draft">ASSIGNER UN NOUVEAU JOUEUR</button>` : ""}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div class="app-modal" id="team-draft-modal" aria-hidden="true">
    <div class="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="team-draft-title">
      <div class="app-modal-header">
        <h2 class="app-modal-title" id="team-draft-title">DRAFTER UN JOUEUR</h2>
        <button type="button" class="app-modal-close" data-team-action="close-draft" aria-label="Fermer">✕</button>
      </div>
      <div class="app-modal-list" id="team-draft-options">
        ${renderDraftModalOptions(draft.rosterIds)}
      </div>
    </div>
  </div>
</section>
`;
}

export async function teamPage() {
  const user = getCurrentUser();
  const draft = loadDraft(user?.id);
  return renderTeamMarkup(draft);
}

export function teamEvents() {
  const user = getCurrentUser();
  if (!user) return;

  let draft = loadDraft(user.id);
  const pageRoot = document.querySelector(".team-page");
  if (!pageRoot) return;

  const persistDraft = () => saveTeamDraft(user.id, draft);

  const refreshPage = () => {
    persistDraft();
    window.navigate?.("equipe");
  };

  const setFeedback = (message, isError = false) => {
    const feedback = document.querySelector("#team-feedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle("is-error", isError);
  };

  const openDraftModal = () => {
    const modal = document.querySelector("#team-draft-modal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeDraftModal = () => {
    const modal = document.querySelector("#team-draft-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  document.querySelector("#team-name-input")?.addEventListener("input", (event) => {
    draft.name = event.target.value.trim().toUpperCase() || "BASKUP";
    persistDraft();
  });

  document.querySelector("#team-emblem-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("L'emblème ne doit pas dépasser 5 Mo.", { type: "error" });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      draft.emblemUrl = reader.result;
      persistDraft();
      refreshPage();
      showToast("Emblème mis à jour.");
    };
    reader.readAsDataURL(file);
  });

  pageRoot.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-team-action]");
    if (actionEl) {
      const action = actionEl.dataset.teamAction;

      if (action === "open-draft") {
        if (draft.rosterIds.length >= MAX_ROSTER) {
          showToast(`Effectif complet (${MAX_ROSTER} joueurs max).`, { type: "error" });
          return;
        }
        openDraftModal();
        return;
      }

      if (action === "close-draft") {
        closeDraftModal();
        return;
      }

      if (action === "cancel") {
        draft = draft.deployedSnapshot ? cloneDraft(draft.deployedSnapshot) : getDefaultDraft();
        persistDraft();
        refreshPage();
        showToast("Modifications annulées.");
        return;
      }

      if (action === "deploy") {
        if (draft.rosterIds.length < MIN_ROSTER) {
          const message = `Il faut au moins ${MIN_ROSTER} joueurs pour déployer l'effectif.`;
          setFeedback(message, true);
          showToast(message, { type: "error" });
          return;
        }

        draft.deployedSnapshot = cloneDraft(draft);
        persistDraft();
        setFeedback("Effectif déployé et prêt pour le tournoi.");
        showToast(`L'effectif ${draft.name} a été déployé.`);
        return;
      }
    }

    const draftPlayerBtn = event.target.closest("[data-draft-player]");
    if (draftPlayerBtn) {
      const playerId = draftPlayerBtn.dataset.draftPlayer;
      if (!playerId || draft.rosterIds.includes(playerId)) return;
      if (draft.rosterIds.length >= MAX_ROSTER) return;

      draft.rosterIds.push(playerId);
      persistDraft();
      closeDraftModal();
      refreshPage();
      showToast("Joueur ajouté à l'effectif.");
      return;
    }

    const removeBtn = event.target.closest(".player-card-close");
    if (removeBtn) {
      const card = removeBtn.closest("[data-player-id]");
      const playerId = card?.dataset.playerId;
      if (!playerId) return;

      draft.rosterIds = draft.rosterIds.filter((id) => id !== playerId);
      persistDraft();
      refreshPage();
      showToast("Joueur retiré de l'effectif.");
    }
  });

  document.querySelector("#team-draft-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "team-draft-modal") {
      closeDraftModal();
    }
  });
}
