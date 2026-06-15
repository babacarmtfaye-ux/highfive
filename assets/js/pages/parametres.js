import { getCurrentUser, updateUser } from "../auth.js";
import { applyTheme, getUserPreferences, saveUserPreferences, showToast } from "../user-data.js";

function renderAccountPanel(user, prefs) {
  return `
    <div class="settings-panel is-active" data-settings-panel="compte">
      <div class="settings-card">
        <h2 class="settings-card-title">INFORMATIONS DU COMPTE</h2>
        <hr class="settings-card-divider" />
        <div class="settings-field">
          <label class="settings-label" for="settings-name">Nom Complet</label>
          <input class="settings-input" id="settings-name" type="text" value="${user?.name || ""}" />
        </div>
        <div class="settings-field">
          <label class="settings-label" for="settings-email">Adresse Email</label>
          <input class="settings-input" id="settings-email" type="email" value="${user?.email || ""}" />
        </div>
        <div class="settings-field">
          <label class="settings-label" for="settings-role">Rôle</label>
          <input class="settings-input" id="settings-role" type="text" value="${prefs.role}" />
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
            <input type="checkbox" id="settings-notify-matches"${prefs.notifications.matchUpdates ? " checked" : ""} />
            <span class="settings-toggle-track settings-toggle-track--orange"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-copy">
            <span class="settings-toggle-label">Messages de l'équipe</span>
            <span class="settings-toggle-desc">Notifications pour les nouveaux messages dans le chat d'équipe.</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="settings-notify-team"${prefs.notifications.teamMessages ? " checked" : ""} />
            <span class="settings-toggle-track settings-toggle-track--purple"></span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function renderPrivacyPanel(prefs) {
  return `
    <div class="settings-panel" data-settings-panel="confidentialite">
      <div class="settings-card">
        <h2 class="settings-card-title">CONFIDENTIALITÉ</h2>
        <hr class="settings-card-divider" />

        <div class="settings-toggle-row">
          <div class="settings-toggle-copy">
            <span class="settings-toggle-label">Profil public</span>
            <span class="settings-toggle-desc">Permettre aux autres joueurs de consulter votre profil.</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="settings-profile-public"${prefs.privacy.profilePublic ? " checked" : ""} />
            <span class="settings-toggle-track settings-toggle-track--orange"></span>
          </label>
        </div>

        <div class="settings-toggle-row">
          <div class="settings-toggle-copy">
            <span class="settings-toggle-label">Afficher l'email</span>
            <span class="settings-toggle-desc">Rendre votre adresse email visible sur votre profil.</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="settings-show-email"${prefs.privacy.showEmail ? " checked" : ""} />
            <span class="settings-toggle-track settings-toggle-track--purple"></span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function renderThemePanel(prefs) {
  return `
    <div class="settings-panel" data-settings-panel="theme">
      <div class="settings-card">
        <h2 class="settings-card-title">THÈME DE L'APPLICATION</h2>
        <hr class="settings-card-divider" />
        <div class="settings-theme-options">
          <button type="button" class="settings-theme-btn${prefs.theme === "dark" ? " is-active" : ""}" data-theme-option="dark">Sombre</button>
          <button type="button" class="settings-theme-btn${prefs.theme === "light" ? " is-active" : ""}" data-theme-option="light">Clair</button>
        </div>
      </div>
    </div>
  `;
}

export async function parametresPage() {
  const user = getCurrentUser();
  const prefs = getUserPreferences(user?.id);

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
          <button type="button" class="settings-nav-item is-active" data-settings-tab="compte">
            <span>Compte</span>
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </button>
          <button type="button" class="settings-nav-item" data-settings-tab="confidentialite">
            <span>Confidentialité</span>
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </button>
          <button type="button" class="settings-nav-item" data-settings-tab="theme">
            <span>Thème</span>
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </button>
        </nav>

        <div class="settings-content">
          ${renderAccountPanel(user, prefs)}
          ${renderPrivacyPanel(prefs)}
          ${renderThemePanel(prefs)}

          <div class="settings-actions">
            <p class="settings-feedback" id="settings-feedback" aria-live="polite"></p>
            <button type="button" class="settings-btn-save" id="settings-save-btn">Enregistrer les modifications</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</section>
`;
}

export function parametresEvents() {
  const user = getCurrentUser();
  if (!user) return;

  let selectedTheme = getUserPreferences(user.id).theme;

  const setActiveTab = (tab) => {
    document.querySelectorAll("[data-settings-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.settingsTab === tab);
    });

    document.querySelectorAll("[data-settings-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.settingsPanel === tab);
    });
  };

  document.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.settingsTab));
  });

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTheme = button.dataset.themeOption;
      document.querySelectorAll("[data-theme-option]").forEach((option) => {
        option.classList.toggle("is-active", option.dataset.themeOption === selectedTheme);
      });
      applyTheme(selectedTheme);
    });
  });

  document.querySelector("#settings-save-btn")?.addEventListener("click", async () => {
    const feedback = document.querySelector("#settings-feedback");
    const name = document.querySelector("#settings-name")?.value.trim();
    const email = document.querySelector("#settings-email")?.value.trim();
    const role = document.querySelector("#settings-role")?.value.trim();

    if (!name || !email) {
      feedback.textContent = "Le nom et l'email sont obligatoires.";
      feedback.classList.add("is-error");
      showToast("Le nom et l'email sont obligatoires.", { type: "error" });
      return;
    }

    const prefs = {
      role: role || "Organisateur de Tournoi",
      notifications: {
        matchUpdates: document.querySelector("#settings-notify-matches")?.checked ?? true,
        teamMessages: document.querySelector("#settings-notify-team")?.checked ?? true
      },
      privacy: {
        profilePublic: document.querySelector("#settings-profile-public")?.checked ?? true,
        showEmail: document.querySelector("#settings-show-email")?.checked ?? false
      },
      theme: selectedTheme
    };

    saveUserPreferences(user.id, prefs);
    applyTheme(selectedTheme);

    const result = await updateUser(user.id, { name, email });
    if (!result.ok) {
      feedback.textContent = result.error;
      feedback.classList.add("is-error");
      showToast(result.error, { type: "error" });
      return;
    }

    feedback.textContent = "Modifications enregistrées.";
    feedback.classList.remove("is-error");
    showToast("Paramètres enregistrés.");
  });
}
