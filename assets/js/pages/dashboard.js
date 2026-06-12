import { clearCurrentUser } from "../auth.js";

export function dashboardPage() {
  return `
<section class="app-view dashboard-page" data-view="dashboard" aria-label="Tableau de bord High Five">
    <div class="dashboard-shell"> 
        <aside class="dashboard-sidebar">
            <div class="dashboard-brand">
                <div class="logo-slot" aria-label="Logo High Five"> <img src="assets/images/logo.png"
                        alt="Logo High Five"> </div>
                <div class="dashboard-brand-copy">
                    <h2>HIGH FIVE</h2>
                    <p>Saison 2026</p>
                </div>
            </div>
            <nav class="dashboard-nav"> 

                <a href="#" class="dashboard-nav-item is-active" data-show-view="dashboard"> 
                    <span class="nav-icon nav-icon--grid" aria-hidden="true">
                        <i class="fa-solid fa-table-cells"></i>
                    </span> 
                    TABLEAU DE BORD 
                </a> 
                
                <a href="#" class="dashboard-nav-item " data-show-view="equipe"> 
                    <span class="nav-icon" aria-hidden="true">
                        <i class="fa-solid fa-users"></i>
                    </span> 
                    ÉQUIPES 
                </a>

                <a href="#" class="dashboard-nav-item" data-show-view="calendrier">
                    <span class="nav-icon" aria-hidden="true">
                        <i class="fa-regular fa-calendar"></i>
                    </span> 
                    CALENDRIER
                </a> 

                <a href="#" class="dashboard-nav-item"> 
                    <span class="nav-icon" aria-hidden="true">
                        <i class="fa-solid fa-gear"></i>
                    </span> 
                    PARAMÈTRES 
                </a> 
                
                <a href="#" class="dashboard-nav-item">
                    <span class="nav-icon">
                        <i class="fa-solid fa-user"></i>
                    </span> 
                    PROFIL </a> 
                </nav> 
                
                <button class="dashboard-logout" data-show-view="login">DÉCONNEXION</button>
        </aside>

        <main class="dashboard-main"> 

            <header class="dashboard-topbar">

                <div class="dashboard-topbar-title">HIGH FIVE</div>

                <div class="dashboard-topbar-actions"> 
                    <button class="topbar-action topbar-action--search" aria-label="Rechercher"></button> 
                    
                    <button class="topbar-action topbar-action--bell" aria-label="Notifications"> 
                        
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                        </svg> 
                    </button> 
                    
                    <img src="assets/images/kv.png" alt="Profil Utilisateur" class="dashboard-avatar" /> 
                </div>

            </header>

            <div class="dashboard-content">

                <section class="dashboard-panel dashboard-panel--championship">

                    <div class="dashboard-panel-header">
                        <h2>TABLEAU DE CHAMPIONNAT</h2> 
                        <span class="status-chip">DEMI-FINALES</span>
                    </div>

                    <div class="dashboard-bracket">

                        <div class="dashboard-match-stack">

                            <div class="dashboard-match-card">

                                <div class="match-row match-row--winner">

                                    <div style="display:flex;align-items:center;"> <span class="match-dot"></span>
                                        <span>METRO VIPERS</span>
                                    </div> 
                                    
                                    <strong>88</strong>

                                </div>

                                <div class="match-row"> 
                                    <span>NEON KINGS</span> 
                                    <strong>74</strong> 
                                </div>

                            </div>

                            <div class="dashboard-match-card">

                                <div class="match-row match-row--winner"> 
                                    <span>APEX PREDATORS</span>
                                    <strong>102</strong>
                                </div>

                                <div class="match-row"> 
                                    <span>STEEL TITANS</span> 
                                    <strong>98</strong>    
                                </div>

                            </div>

                        </div>

                        <div class="bracket-connector"></div>

                        <div class="dashboard-final-card">

                            <div class="dashboard-final-title">🏆 MATCH FINAL</div>

                            <div class="match-row match-row--winner"> 
                                <span>METRO VIPERS</span> 
                                <strong>--</strong>
                            </div>

                            <div class="match-row"> 
                                <span>APEX PREDATORS</span>    
                                <strong>--</strong> 
                            </div>

                        </div>

                    </div>

                </section>

                <div class="dashboard-lower-grid">
                    <section class="dashboard-panel dashboard-panel--standings">
                        <div class="dashboard-panel-header dashboard-panel-header--compact">
                            <h2>CLASSEMENT DU GROUPE A</h2> <a href="#">CLASSEMENT COMPLET &rarr;</a>
                        </div>
                        <div class="standings-table">
                            <div class="standings-head"> <span>POS</span> <span>ÉQUIPE</span> <span>V</span>
                                <span>D</span> <span>PTS</span>
                            </div>
                            <div class="standings-row is-highlighted"> <span>1</span> <span>METRO VIPERS</span>
                                <span>8</span> <span>2</span> <span>16</span>
                            </div>
                            <div class="standings-row"> <span>2</span> <span>NEON KINGS</span> <span>7</span>
                                <span>3</span> <span>14</span>
                            </div>
                            <div class="standings-row"> <span>3</span> <span>ROGUE SYNDICATE</span> <span>5</span>
                                <span>5</span> <span>10</span>
                            </div>
                            <div class="standings-row is-muted"> <span>4</span> <span>ALLEY CATS</span> <span>2</span>
                                <span>8</span> <span>4</span>
                            </div>
                        </div>
                    </section>
                    <section class="dashboard-panel dashboard-panel--upcoming">
                        <div class="dashboard-panel-header">
                            <h2>À VENIR</h2>
                        </div>
                        <div class="upcoming-list">
                            <div class="upcoming-card upcoming-card--live"> <span class="live-badge">● EN DIRECT</span>
                                <div class="upcoming-scoreline">
                                    <div> <span>SHADOWS</span> <strong>64</strong> </div>
                                    <div class="versus-label">VS</div>
                                    <div class="upcoming-scoreline--right"> <span>PHANTOMS</span> <strong>58</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="upcoming-card">
                                <div class="upcoming-time"> <small>AUJOURD'HUI</small> <strong>20:00</strong> </div>
                                <div class="upcoming-scoreline">
                                    <div> <span>URBAN KNIGHTS</span> </div>
                                    <div class="versus-label">VS</div>
                                    <div class="upcoming-scoreline--right"> <span>NEON KINGS</span> </div>
                                </div>
                            </div>
                            <div class="upcoming-card">
                                <div class="upcoming-time"> <small>DEMAIN</small> <strong>18:30</strong> </div>
                                <div class="upcoming-scoreline">
                                    <div> <span>STEEL TITANS</span> </div>
                                    <div class="versus-label">VS</div>
                                    <div class="upcoming-scoreline--right"> <span>ALLEY CATS</span> </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</section>
`;
}


export function dashboardEvents() {
  const logoutBtn = document.querySelector(".dashboard-logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
            clearCurrentUser();
      window.navigate("login");
    });
  }

  const navItems = document.querySelectorAll(".dashboard-nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      navItems.forEach(i => i.classList.remove("is-active"));
      item.classList.add("is-active");
    });
  });
}