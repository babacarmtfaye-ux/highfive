export async function profilPage() {
  return `
<section class="app-view dashboard-page profile-page" data-view="profil" aria-label="Profil">
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
        <a href="#" class="dashboard-nav-item" data-show-view="calendrier">
          <span class="nav-icon" aria-hidden="true"><i class="fa-regular fa-calendar"></i></span>
          CALENDRIER
        </a>
        <a href="#" class="dashboard-nav-item" data-show-view="parametres">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-gear"></i></span>
          PARAMÈTRES
        </a>
        <a href="#" class="dashboard-nav-item is-active" data-show-view="profil">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          PROFIL
        </a>
      </nav>

      <button class="dashboard-logout" data-show-view="login">DÉCONNEXION</button>
    </aside>

    <!-- ── MAIN ───────────────────────────────────────────── -->
    <main class="dashboard-main profile-main">

      <div class="profile-content">

        <!-- ── HERO BANNER ──────────────────────────────────── -->
        <div class="profile-hero">

          <!-- Fond terrain -->
          <div class="profile-hero-bg"></div>

          <!-- Barre inférieure : avatar + nom + boutons -->
          <div class="profile-hero-body">

            <div class="profile-avatar-wrap">
              <img src="assets/images/kv.png" alt="Kaelis V." class="profile-avatar" />
            </div>

            <div class="profile-identity">
              <h1 class="profile-name">KAELIS V.</h1>
              <div class="profile-meta">
                <i class="fa-solid fa-basketball" aria-hidden="true"></i>
                <span>Ailier fort</span>
                <span class="profile-meta-dot">•</span>
                <span>#12</span>
              </div>
            </div>

            <div class="profile-hero-actions">
              <button class="profile-btn profile-btn--outline">
                <i class="fa-solid fa-pen" aria-hidden="true"></i>
                <span>Éditer</span>
              </button>
              <button class="profile-btn profile-btn--filled">
                <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
                <span>Partager</span>
              </button>
            </div>

          </div>
        </div>
        <!-- /profile-hero -->

        <!-- ── STATISTIQUES GLOBALES ─────────────────────────── -->
        <div class="profile-section">
          <div class="profile-section-header">
            <i class="fa-solid fa-chart-simple" aria-hidden="true"></i>
            <h2 class="profile-section-title">STATISTIQUES GLOBALES</h2>
          </div>

          <div class="profile-stats-grid">
            <div class="profile-stat-card">
              <span class="profile-stat-label">Matchs Joués</span>
              <span class="profile-stat-value">124</span>
            </div>
            <div class="profile-stat-card profile-stat-card--accent">
              <span class="profile-stat-label">Titres MVP</span>
              <span class="profile-stat-value">15</span>
            </div>
            <div class="profile-stat-card">
              <span class="profile-stat-label">Moyenne de Points (PPG)</span>
              <span class="profile-stat-value">24.5</span>
            </div>
          </div>
        </div>

        <!-- ── TROPHÉES & SUCCÈS ──────────────────────────────── -->
        <div class="profile-section">
          <div class="profile-section-header">
            <i class="fa-solid fa-trophy" aria-hidden="true"></i>
            <h2 class="profile-section-title">TROPHÉES & SUCCÈS</h2>
          </div>

          <div class="profile-trophy-grid">
            <div class="profile-trophy-card">
              <div class="profile-trophy-icon">
                <i class="fa-solid fa-trophy" aria-hidden="true"></i>
              </div>
              <div class="profile-trophy-copy">
                <span class="profile-trophy-title">Champion Régional</span>
                <span class="profile-trophy-sub">Saison Hiver 2023</span>
              </div>
            </div>
            <div class="profile-trophy-card">
              <div class="profile-trophy-icon">
                <i class="fa-solid fa-fire" aria-hidden="true"></i>
              </div>
              <div class="profile-trophy-copy">
                <span class="profile-trophy-title">Série de Victoires</span>
                <span class="profile-trophy-sub">10 matchs consécutifs</span>
              </div>
            </div>
            <div class="profile-trophy-card">
              <div class="profile-trophy-icon">
                <i class="fa-solid fa-star" aria-hidden="true"></i>
              </div>
              <div class="profile-trophy-copy">
                <span class="profile-trophy-title">Sélection All-Star</span>
                <span class="profile-trophy-sub">Édition Été 2023</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- /profile-content -->

    </main>
  </div>
</section>
`;
}