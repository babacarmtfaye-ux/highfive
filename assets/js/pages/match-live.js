export async function matchLivePage() {
  return `
<section class="app-view match-live-page" data-view="match-live" aria-label="Match en direct">

  <!-- ── TOPBAR ─────────────────────────────────────────────── -->
  <header class="match-topbar">
    <div class="match-topbar-brand">HIGH FIVE</div>
    <div class="match-topbar-actions">
      <button class="topbar-action topbar-action--search" aria-label="Rechercher"></button>
      <button class="topbar-action topbar-action--bell" aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 01-3.46 0"></path>
        </svg>
      </button>
      <img src="assets/images/kv.png" alt="Profil" class="dashboard-avatar" />
    </div>
  </header>

  <!-- ── CONTENT ────────────────────────────────────────────── -->
  <div class="match-live-content">

    <!-- Nav retour + badge -->
    <div class="match-live-nav">
      <button class="match-back-btn" data-show-view="calendrier">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        <span>Retour au Calendrier</span>
      </button>
      <div class="match-live-badge">
        <span class="match-live-dot"></span>
        EN DIRECT
      </div>
    </div>

    <!-- Hero score -->
    <div class="match-hero">
      <div class="match-team match-team--home">
        <div class="match-team-logo">
          <img src="assets/images/logo.png" alt="Baskup" />
        </div>
        <div class="match-team-name">BASKUP</div>
        <div class="match-team-label">DOMICILE</div>
      </div>

      <div class="match-center">
        <div class="match-quarter">4ÈME QUART-TEMPS</div>
        <div class="match-chrono">04:12</div>
        <div class="match-score">
          <span class="match-score-home">84</span>
          <span class="match-score-sep">-</span>
          <span class="match-score-away">79</span>
        </div>
      </div>

      <div class="match-team match-team--away">
        <div class="match-team-logo">
          <img src="assets/images/logo2.png" alt="City Kings" />
        </div>
        <div class="match-team-name">CITY KINGS</div>
        <div class="match-team-label">EXTÉRIEUR</div>
      </div>
    </div>

    <!-- Two columns -->
    <div class="match-live-body">

      <!-- ── STATS TABLE ──────────────────────────────────── -->
      <div class="match-stats-panel">
        <h2 class="match-panel-title">STATISTIQUES DES JOUEURS</h2>

        <div class="match-stats-table">
          <div class="match-stats-head">
            <span class="col-player">JOUEUR</span>
            <span class="col-stat">MIN</span>
            <span class="col-stat">PTS</span>
            <span class="col-stat">REB</span>
            <span class="col-stat">PAS</span>
          </div>

          ${[
            { num: 8,  name: "R.Rudy",   min: "32:14", pts: 24, reb: 6,  pas: 8,  accent: true },
            { num: 13, name: "M. Mia",   min: "32:14", pts: 18, reb: 12, pas: 2,  accent: true },
            { num: 5,  name: "A. Stella",min: "32:14", pts: 12, reb: 3,  pas: 5,  accent: false },
            { num: 2,  name: "J. Léo",   min: "32:14", pts: 22, reb: 0,  pas: 4,  accent: true },
            { num: 3,  name: "M. Mike",  min: "32:14", pts: 8,  reb: 24, pas: 2,  accent: false },
            { num: 5,  name: "A. Wright",min: "32:14", pts: 12, reb: 3,  pas: 5,  accent: false },
            { num: 8,  name: "J. Carter",min: "32:14", pts: 24, reb: 6,  pas: 8,  accent: true },
            { num: 13, name: "M. Davis", min: "32:14", pts: 18, reb: 12, pas: 2,  accent: true },
            { num: 6,  name: "A. Right", min: "32:14", pts: 14, reb: 3,  pas: 5,  accent: true },
            { num: 5,  name: "A. Wright",min: "32:14", pts: 12, reb: 3,  pas: 5,  accent: false },
          ].map(p => `
            <div class="match-stats-row">
              <span class="col-player">
                <span class="player-num">${p.num}</span>
                <span class="player-name-cell">${p.name}</span>
              </span>
              <span class="col-stat">${p.min}</span>
              <span class="col-stat ${p.accent ? "stat--accent" : ""}">${p.pts}</span>
              <span class="col-stat">${p.reb}</span>
              <span class="col-stat">${p.pas}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- ── ACTIONS CLÉS ─────────────────────────────────── -->
      <div class="match-actions-panel">
        <div class="match-actions-header">
          <h2 class="match-panel-title">ACTIONS CLÉS</h2>
          <button class="match-actions-refresh" aria-label="Actualiser">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          </button>
        </div>

        <div class="match-actions-feed">

          <div class="match-action-item match-action-item--highlight">
            <div class="action-meta">
              <i class="fa-solid fa-play action-play-icon" aria-hidden="true"></i>
              <span class="action-time">Q4 · 04:12</span>
              <span class="action-team action-team--home">Baskup</span>
            </div>
            <p class="action-desc">R. Rudy réussit un tir à 3 points. Passe décisive de M. Mia.</p>
            <div class="action-score-inline">84 - 79</div>
          </div>

          <div class="match-action-item">
            <div class="action-meta">
              <i class="fa-solid fa-chevron-right action-chevron" aria-hidden="true"></i>
              <span class="action-time">Q4 · 04:45</span>
              <span class="action-team action-team--away">KINGS</span>
            </div>
            <p class="action-desc">D. Smith rebond défensif.</p>
          </div>

          <div class="match-action-item">
            <div class="action-meta">
              <i class="fa-solid fa-chevron-right action-chevron" aria-hidden="true"></i>
              <span class="action-time">Q4 · 05:02</span>
              <span class="action-team action-team--away">KINGS</span>
            </div>
            <p class="action-desc">T. Johnson manque un double-pas.</p>
          </div>

          <div class="match-action-item">
            <div class="action-meta">
              <span class="action-time">Q4 · 05:30</span>
              <span class="action-team action-team--home">Baskup</span>
            </div>
            <p class="action-desc action-desc--muted">TEMPS MORT · COMPLET</p>
          </div>

        </div>
      </div>

    </div>
    <!-- /match-live-body -->

  </div>
  <!-- /match-live-content -->

</section>
`;
}