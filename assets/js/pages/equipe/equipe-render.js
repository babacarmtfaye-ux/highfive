import { MAX_ROSTER, MIN_ROSTER } from "./equipe-constants.js";
import { getPlayerById } from "./equipe-players.js";

export function renderPlayerCard(player) {
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

export function renderAvailablePlayers(availablePlayers) {
  if (!availablePlayers.length) {
    return `<p class="team-feedback">Aucun compte joueur disponible pour le moment.</p>`;
  }

  return availablePlayers.map((player) => `
      <div class="registered-player-row">
        <span class="registered-player-main">
          <strong>${player.firstName} ${player.lastName}</strong>
          <span>${player.position} · ${player.height}</span>
        </span>
        <span class="registered-player-status">DISPO</span>
      </div>
    `).join("");
}

export function renderDraftModalOptions(playerCatalog, takenPlayerIds, currentFranchiseRoster, franchises) {
  if (!playerCatalog.length) {
    return `<p class="team-feedback">Aucun joueur dans la base.</p>`;
  }

  // Filter out players already in the coach's own team
  const options = playerCatalog.filter((player) => !currentFranchiseRoster.map(String).includes(String(player.id)));

  if (!options.length) {
    return `<p class="team-feedback">Tous les joueurs possibles font déjà partie de votre effectif.</p>`;
  }

  return options.map((player) => {
    const isTaken = takenPlayerIds.has(String(player.id));
    let statusLabel = "AGENT LIBRE";
    let statusStyle = "color: #2ec4b6; border-color: #2ec4b6;";
    let actionLabel = "DRAFTER";

    if (isTaken) {
      const ownerTeam = franchises.find(f => f.rosterIds && f.rosterIds.map(String).includes(String(player.id)));
      statusLabel = ownerTeam ? `SIGNÉ : ${ownerTeam.name}` : "SOUS CONTRAT";
      statusStyle = "color: #f06c19; border-color: #f06c19;";
      actionLabel = "TRANSFÉRER";
    }

    return `
      <div class="app-modal-option" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--card-border); background: rgba(255,255,255,0.01);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${player.image}" alt="" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
          <span class="app-modal-option-copy" style="display: flex; flex-direction: column; text-align: left;">
            <strong style="color: var(--text-primary); font-size: 13px;">${player.firstName} ${player.lastName}</strong>
            <span style="font-size: 11px; color: var(--text-muted);">${player.position} · ${player.height}</span>
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 9px; font-weight: 800; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--card-border); ${statusStyle}">${statusLabel}</span>
          <button type="button" class="dashboard-btn-deploy" style="padding: 6px 12px; font-size: 10px; border-radius: 4px; background: transparent; cursor: pointer; transition: all 0.2s;" data-draft-player="${player.id}" data-action-type="${isTaken ? "transfer" : "draft"}">
            ${actionLabel}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

export function renderFranchiseSummary(franchises, playerCatalog, currentUserId) {
  const visibleFranchises = franchises.filter((franchise) => String(franchise.ownerId) !== String(currentUserId));

  if (!visibleFranchises.length) {
    return `<p class="team-feedback">Aucune autre franchise déployée.</p>`;
  }

  return visibleFranchises.map((franchise) => {
    const rosterNames = (franchise.rosterIds || [])
      .map((playerId) => getPlayerById(playerCatalog, playerId))
      .filter(Boolean)
      .map((player) => `${player.firstName} ${player.lastName}`)
      .slice(0, 3);

    return `
      <div class="registered-player-row">
        <span class="registered-player-main">
          <strong>${franchise.name}</strong>
          <span>${rosterNames.length ? rosterNames.join(", ") : "Aucun joueur"}</span>
        </span>
        <span class="registered-player-status">${(franchise.rosterIds || []).length} PRIS</span>
      </div>
    `;
  }).join("");
}

export function renderTeamMarkup(draft, playerCatalog, availablePlayers, franchises, currentUserId) {
  const rosterPlayers = draft.rosterIds.map((id) => getPlayerById(playerCatalog, id)).filter(Boolean);
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
            <div class="dashboard-kicker">ESPACE COACH</div>
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
              <div class="dashboard-input-teamname" style="padding: 0; border: none; background: transparent;">
                <input type="text" id="team-name-input" value="${draft.name}" maxlength="24" aria-label="Nom de l'équipe" style="width: 100%; height: 100%; border: 1px solid var(--card-border); background: var(--bg-secondary, #1a1a1a); color: var(--text-primary); padding: 10px 14px; border-radius: 6px;" />
              </div>

              <div class="dashboard-emblem-label" style="margin-top: 16px;">EMBLÈME DE LA FRANCHISE</div>
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
                Seuls les utilisateurs qui ont créé un compte et qui ne sont pas déjà pris par une franchise peuvent être draftés.
              </p>
              <p class="team-feedback" id="team-feedback" aria-live="polite"></p>
            </div>

            <div class="registered-players-box">
              <div class="requirements-header">
                <i class="fa-solid fa-clipboard-list" aria-hidden="true"></i>
                <span>Joueurs disponibles</span>
              </div>
              <div class="registered-player-list">
                ${renderAvailablePlayers(availablePlayers)}
              </div>
            </div>

            <div class="registered-players-box">
              <div class="requirements-header">
                <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Autres franchises</span>
              </div>
              <div class="registered-player-list">
                ${renderFranchiseSummary(franchises, playerCatalog, currentUserId)}
              </div>
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
    <div class="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="team-draft-title" style="width: min(500px, 95vw); max-height: 80vh; display: flex; flex-direction: column;">
      <div class="app-modal-header">
        <h2 class="app-modal-title" id="team-draft-title">DRAFTER OU TRANSFÉRER UN JOUEUR</h2>
        <button type="button" class="app-modal-close" data-team-action="close-draft" aria-label="Fermer">✕</button>
      </div>
      <div class="app-modal-list" id="team-draft-options" style="overflow-y: auto; flex: 1;">
        <!-- Injecté dynamiquement par teamPage / renderDraftModalOptions -->
      </div>
    </div>
  </div>
</section>
  `;
}

export function renderPlayerViewMarkup(playerTeam, franchises, playerCatalog) {
  let statusText = "";
  let teamDetailsHtml = "";

  if (playerTeam) {
    statusText = `<span class="dashboard-roster-count" style="background-color: var(--accent-color); color: #111;">DRAFTÉ</span>`;
    
    const rosterPlayers = (playerTeam.rosterIds || [])
      .map((id) => getPlayerById(playerCatalog, id))
      .filter(Boolean);

    const coachUser = playerCatalog.find(p => String(p.id) === String(playerTeam.ownerId));
    const coachName = coachUser ? `${coachUser.firstName} ${coachUser.lastName}` : "Manager de la Ligue";

    const rosterCards = rosterPlayers.map(p => `
      <div class="player-card" data-player-id="${p.id}" style="cursor: default;">
        <div class="player-card-photo-left">
          <img src="${p.image}" alt="${p.firstName} ${p.lastName}" class="player-card-image" />
        </div>
        <div class="player-card-bg-right">
          <span class="player-position">${p.position}</span>
          <div class="player-name">${p.firstName.toUpperCase()}<br>${p.lastName.toUpperCase()}</div>
          <div class="player-stats">${p.height} · ${p.weight}</div>
        </div>
      </div>
    `).join("");

    teamDetailsHtml = `
      <div class="dashboard-panel-identity" style="margin-bottom: 20px;">
        <div class="dashboard-section-title">VOTRE FRANCHISE</div>
        <hr class="dashboard-section-divider" />
        <div style="display: flex; align-items: center; gap: 20px;">
          <img src="${playerTeam.emblemUrl || "assets/images/logo.png"}" alt="Emblème" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid var(--card-border); padding: 5px; background: #1a1a1a; border-radius: 6px;" />
          <div>
            <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 28px; margin: 0; color: var(--text-primary); letter-spacing: 1.5px;">${playerTeam.name}</h3>
            <span style="font-size: 11px; color: var(--text-muted);">COACH : <strong>${coachName.toUpperCase()}</strong></span>
          </div>
        </div>
      </div>

      <div class="team-right" style="margin-top: 10px;">
        <div class="roster-header">
          <span class="dashboard-roster-title">EFFECTIF DE L'ÉQUIPE</span>
          <span class="dashboard-roster-count">${rosterPlayers.length} JOUEURS</span>
        </div>
        <div class="players-grid">
          ${rosterCards}
        </div>
      </div>
    `;
  } else {
    statusText = `<span class="dashboard-roster-count" style="background-color: #f06c19; color: #fff;">FREE AGENT</span>`;
    teamDetailsHtml = `
      <div class="requirements-box" style="padding: 24px; text-align: center; border: 1px dashed var(--card-border); margin-bottom: 20px;">
        <i class="fa-solid fa-basketball" style="font-size: 40px; color: var(--accent-color); margin-bottom: 12px;"></i>
        <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 24px; margin: 0 0 8px 0; letter-spacing: 1px;">VOUS ÊTES AGENT LIBRE</h3>
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6; max-width: 400px; margin: 0 auto;">
          Vous n'êtes actuellement rattaché à aucune franchise. Les coachs de la ligue peuvent vous recruter lors de la draft ou vous transférer. Complétez votre profil pour maximiser vos chances !
        </p>
      </div>
    `;
  }

  const allFranchisesMarkup = franchises.map(f => {
    const coachUser = playerCatalog.find(p => String(p.id) === String(f.ownerId));
    const coachName = coachUser ? `${coachUser.firstName} ${coachUser.lastName}` : "Coach High Five";
    const size = (f.rosterIds || []).length;
    return `
      <div class="registered-player-row" style="padding: 12px 14px;">
        <span class="registered-player-main">
          <strong style="font-size: 14px; font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; color: var(--text-primary);">${f.name}</strong>
          <span style="font-size: 11px; color: var(--text-muted);">Coach : ${coachName} · ${size} joueurs</span>
        </span>
        <span class="registered-player-status" style="font-size: 10px; font-weight: 800; color: var(--accent-color);">${size} SIGNÉS</span>
      </div>
    `;
  }).join("");

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
            <div class="dashboard-kicker">ESPACE JOUEUR</div>
            <div class="dashboard-page-title" style="display: flex; align-items: center; gap: 16px;">
              <span>STATUT DE FRANCHISE</span>
              ${statusText}
            </div>
          </div>
        </div>

        <div class="team-body" style="grid-template-columns: 1fr; gap: 24px;">
          ${teamDetailsHtml}

          <div class="registered-players-box" style="margin-top: 10px;">
            <div class="requirements-header">
              <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>FRANCHISES DE LA LIGUE</span>
            </div>
            <div class="registered-player-list" style="max-height: 400px;">
              ${allFranchisesMarkup || `<p class="team-feedback">Aucune franchise enregistrée dans la ligue.</p>`}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</section>
  `;
}
