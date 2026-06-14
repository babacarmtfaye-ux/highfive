export async function parametresPage() {
return `
    <section class="app-view dashboard-page settings-page" data-view="parametres" aria-label="Paramètres">
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
                            <a href="#" class="dashboard-nav-item is-active" data-show-view="parametres">
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

                    <main class="dashboard-main settings-main">

                        <div class="settings-hero">
                            <h1 class="settings-title">PARAMÈTRES</h1>
                            <p class="settings-subtitle">Gérez vos préférences de compte et d'application.</p>
                        </div>


                        <div class="settings-body">
                            <nav class="settings-nav" aria-label="Navigation paramètres">
                                <button class="settings-nav-item is-active" data-settings-tab="compte">
                                    <span>Compte</span>
                                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                </button>
                                <button class="settings-nav-item" data-settings-tab="confidentialite">
                                    <span>Confidentialité</span>
                                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                </button>
                                <button class="settings-nav-item" data-settings-tab="theme">
                                    <span>Thème</span>
                                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                </button>
                            </nav>

                        <div class="settings-content">
                            <div class="settings-card">
                                <h2 class="settings-card-title">INFORMATIONS DU COMPTE</h2>
                                <hr class="settings-card-divider" />
                                <div class="settings-field">
                                    <label class="settings-label">Nom Complet</label>
                                    <input class="settings-input" type="text" value="Kaelis Vortan" />
                                </div>
                                
                                <div class="settings-field">
                                    <label class="settings-label">Adresse Email</label>
                                    <input class="settings-input" type="email" value="kaelis.vortan@highfive.com" />
                                </div>

                                <div class="settings-field">
                                    <label class="settings-label">Rôle</label>
                                    <input class="settings-input" type="text" value="Organisateur de Tournoi" />
                                </div>
                            </div>

                            <div class="settings-card">
                                <h2 class="settings-card-title">PRÉFÉRENCES DE NOTIFICATION</h2>
                                <hr class="settings-card-divider" />

                                <div class="settings-toggle-row">
                                    <div class="settings-toggle-copy">
                                    <span class="settings-toggle-label">Mises à jour des matchs</span>
                                    <span class="settings-toggle-desc">Recevoir des alertes pour les changements de score et statuts.</span>
                                </div>
                                <label class="settings-toggle">
                                    <input type="checkbox" checked />
                                    <span class="settings-toggle-track settings-toggle-track--orange"></span>
                                </label>
                            </div>

                            <div class="settings-toggle-row">
                                <div class="settings-toggle-copy">
                                    <span class="settings-toggle-label">Messages de l'équipe</span>
                                    <span class="settings-toggle-desc">Notifications pour les nouveaux messages dans le chat d'équipe.</span>
                                </div>
                                <label class="settings-toggle">
                                    <input type="checkbox" checked />
                                    <span class="settings-toggle-track settings-toggle-track--purple"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-actions">
                            <button class="settings-btn-save">Enregistrer les modifications</button>
                        </div>

                    </div>

                </div>

            </main>
        </div>
    </section>
`;
}