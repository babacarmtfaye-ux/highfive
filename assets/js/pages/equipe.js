const TEAM_API_URL = "http://localhost:3001/players";

export async function teamPage() {
  const response = await fetch(TEAM_API_URL);
  const data = await response.json();
  const players = Array.isArray(data) ? data : [];

  const getInitials = (firstName, lastName) => {
    return [firstName, lastName]
      .filter(Boolean)
      .map((part) => part.trim()[0]?.toUpperCase() || "")
      .join("");
  };

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
        <a href="#" class="dashboard-nav-item">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-gear"></i></span>
          PARAMÈTRES
        </a>
        <a href="#" class="dashboard-nav-item">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          PROFIL
        </a>
      </nav>

      <button class="dashboard-logout" data-show-view="login">DÉCONNEXION</button>
    </aside>

    <main class="dashboard-main">

      <!-- Topbar -->
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
            <button class="dashboard-btn-cancel"><span>ANNULER</span></button>
            <button class="dashboard-btn-deploy"><span>DÉPLOYER L'EFFECTIF</span></button>
          </div>
        </div>

        <div class="team-body">

          <div class="team-left">

            <div class="dashboard-panel-identity">
              <div class="dashboard-section-title">IDENTITÉ</div>
              <hr class="dashboard-section-divider" />

              <div class="dashboard-label-text">DÉSIGNATION DE L'ÉQUIPE</div>
              <div class="dashboard-input-teamname"><span>BASKUP</span></div>

              <div class="dashboard-emblem-label">EMBLÈME DE LA FRANCHISE</div>
              <div class="dashboard-upload">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div class="upload-label">TÉLÉCHARGER L'EMBLÈME</div>
                <div class="upload-sub">SVG, PNG, JPG (MAX 5MO)</div>
              </div>
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
                Un effectif de tournoi valide nécessite un minimum de 5 joueurs actifs et un maximum de 12.
                Assurez-vous que toutes les positions sont correctement couvertes avant le déploiement.
              </p>
            </div>

          </div>

          <div class="team-right">

            <div class="roster-header">
              <div class="roster-header-left">
                <span class="dashboard-roster-title">EFFECTIF ACTIF</span>
                <span class="dashboard-roster-count">3 / 12 PLACES</span>
              </div>
              <button class="dashboard-btn-draft-player">
                <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
                <span>DRAFTER UN JOUEUR</span>
              </button>
            </div>

            <div class="players-grid">

              <div class="player-card">
                <div class="player-card-photo-left">
                  <img src="assets/images/players/marcus.png" alt="Marcus Reed" class="player-card-image" />
                </div>
                <div class="player-card-bg-right">
                  <span class="player-position">PG</span>
                  <div class="player-name">MARCUS<br>REED</div>
                  <div class="player-stats">6'2" · 185 LBS</div>
                </div>
                <button class="player-card-close" aria-label="Retirer Marcus Reed">✕</button>
              </div>

              <div class="player-card">
                <div class="player-card-photo-left">
                  <img src="assets/images/players/tyler.png" alt="Tyler Vance" class="player-card-image" />
                </div>
                <div class="player-card-bg-right">
                  <span class="player-position">SF</span>
                  <div class="player-name">TYLER<br>VANCE</div>
                  <div class="player-stats">6'7" · 228 LBS</div>
                </div>
                <button class="player-card-close" aria-label="Retirer Tyler Vance">✕</button>
              </div>

              <div class="player-card">
                <div class="player-card-photo-left">
                  <img src="assets/images/players/david.png" alt="David Chen" class="player-card-image" />
                </div>
                <div class="player-card-bg-right">
                  <span class="player-position">C</span>
                  <div class="player-name">DAVID<br>CHEN</div>
                  <div class="player-stats">6'11" · 250 LBS</div>
                </div>
                <button class="player-card-close" aria-label="Retirer David Chen">✕</button>
              </div>

              <div class="add-player-card">
                <span>ASSIGNER UN NOUVEAU JOUEUR</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  </div>
</section>
`;
}