export async function calendrierPage() {

    const months = [
        "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
        "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"
    ];

    const days = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

    // Données mock des événements
    const events = {
        "2026-10-02": [{ label: "Vipers vs", color: "orange" }],
        "2026-10-04": [{ label: "Finales - Élite", color: "orange" }],
        "2026-10-06": [
            { label: "Tournoi U18", color: "default" },
            { label: "Lions vs Be", color: "default" }
        ]
    };

    // Génère les cellules du mois
    function buildCalendarGrid(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Lundi = 0, Dimanche = 6
        let startDow = firstDay.getDay(); // 0=dim
        startDow = startDow === 0 ? 6 : startDow - 1;

        const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;
        let cells = "";

        for (let i = 0; i < totalCells; i++) {
            const dayNum = i - startDow + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= lastDay.getDate();
            const date = new Date(year, month, dayNum);
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const isToday = dayNum === 4 && month === 9 && year === 2026; // mock "today"
            const dayEvents = events[dateKey] || [];

            const dow = (startDow + dayNum - 1) % 7; // 0=lun … 6=dim
            const isSat = dow === 5;
            const isSun = dow === 6;

            cells += `
        <div class="cal-cell ${!isCurrentMonth ? "cal-cell--out" : ""} ${isToday ? "cal-cell--today" : ""} ${isSat ? "cal-cell--sat" : ""} ${isSun ? "cal-cell--sun" : ""}">
          <span class="cal-day-num">${isCurrentMonth ? dayNum : ""}</span>
          ${dayEvents.map(e => `
            <div class="cal-event cal-event--${e.color}">
              ${e.color === "orange" ? '<span class="cal-event-dot"></span>' : ""}
              <span>${e.label}</span>
            </div>
          `).join("")}
        </div>
      `;
        }
        return cells;
    }

    const grid = buildCalendarGrid(2026, 9); // Octobre 2026 (0-indexed)

    return `
<section class="app-view dashboard-page cal-page" data-view="calendrier" aria-label="Calendrier des matchs">
  <div class="dashboard-shell">

    <!-- ── SIDEBAR ─────────────────────────────────────────── -->
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
        <a href="#" class="dashboard-nav-item is-active" data-show-view="calendrier">
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

    <!-- ── MAIN ───────────────────────────────────────────── -->
    <main class="dashboard-main cal-main">

      <!-- Page title (remplace la topbar) -->
      <header class="cal-header">
        <div class="cal-header-left">
          <div class="dashboard-topbar-title">CALENDRIER DES MATCHS</div>
        </div>
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

      <!-- Content -->
      <div class="cal-content">

        <!-- ── CALENDAR PANEL ────────────────────────────── -->
        <div class="cal-panel">

          <!-- Month navigation -->
          <div class="cal-nav">
            <button class="cal-nav-btn" aria-label="Mois précédent">&#8249;</button>
            <h2 class="cal-month-title">OCTOBRE 2026</h2>
            <button class="cal-nav-btn" aria-label="Mois suivant">&#8250;</button>
          </div>

          <!-- Day headers -->
          <div class="cal-grid">
            ${days.map(d => `<div class="cal-dow">${d}</div>`).join("")}
            ${grid}
          </div>

        </div>
        <!-- /cal-panel -->

        <!-- ── MATCHS DU JOUR ────────────────────────────── -->
        <aside class="cal-sidebar">

          <div class="cal-sidebar-header">
            <i class="fa-solid fa-basketball" aria-hidden="true"></i>
            <span>MATCHS DU JOUR</span>
          </div>

          <!-- Match LIVE -->
          <div class="cal-match-card cal-match-card--live">
            <div class="cal-match-venue">
              <span>Terrain Central</span>
              <span class="cal-live-badge"><span class="cal-live-dot"></span>LIVE</span>
            </div>
            <div class="cal-match-score">
              <div class="cal-match-team">
                <div class="cal-team-logo">
                  <img src="assets/images/logo.png" alt="Vipers" />
                </div>
                <span class="cal-team-name">VIPERS</span>
              </div>
              <div class="cal-match-score-center">
                <span class="cal-score">78 - 74</span>
                <span class="cal-match-meta">Q4 · 02:15</span>
              </div>
              <div class="cal-match-team">
                <div class="cal-team-logo">
                  <img src="assets/images/logo.png" alt="Kings" />
                </div>
                <span class="cal-team-name">KINGS</span>
              </div>
            </div>
          </div>

          <!-- Match à venir -->
          <div class="cal-match-card">
            <div class="cal-match-venue">
              <span>Terrain 2</span>
              <span class="cal-match-time">20:30</span>
            </div>
            <div class="cal-match-upcoming">
              <div class="cal-team-pill">
                <span class="cal-team-pill-name">LIONS</span>
                <span class="cal-team-pill-abbr">LIO</span>
              </div>
              <span class="cal-vs">VS</span>
              <div class="cal-team-pill">
                <span class="cal-team-pill-name">BEARS</span>
                <span class="cal-team-pill-abbr">BEA</span>
              </div>
            </div>
          </div>

        </aside>
        <!-- /cal-sidebar -->

      </div>
      <!-- /cal-content -->

    </main>
  </div>
</section>
`;
}