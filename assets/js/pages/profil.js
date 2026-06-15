import { getCurrentUser } from "../auth.js";
import { getUserProfile, saveUserProfile, showToast } from "../user-data.js";

function renderProfileMarkup(user, profile) {
  return `
<section class="app-view dashboard-page profile-page" data-view="profil" aria-label="Profil">
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
        <a href="#" class="dashboard-nav-item is-active" data-show-view="profil">
          <span class="nav-icon" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          PROFIL
        </a>
      </nav>

      <button class="dashboard-logout" data-show-view="login">DÉCONNEXION</button>
    </aside>

    <main class="dashboard-main profile-main">
      <div class="profile-content">
        <div class="profile-hero">
          <div class="profile-hero-bg"></div>
          <div class="profile-hero-body">
            <div class="profile-avatar-wrap">
              <img src="${profile.avatarUrl}" alt="${profile.displayName}" class="profile-avatar" id="profile-avatar" />
            </div>

            <div class="profile-identity">
              <h1 class="profile-name" id="profile-display-name">${profile.displayName}</h1>
              <div class="profile-meta">
                <i class="fa-solid fa-basketball" aria-hidden="true"></i>
                <span id="profile-position">${profile.position}</span>
                <span class="profile-meta-dot">•</span>
                <span id="profile-number">#${profile.number}</span>
              </div>
            </div>

            <div class="profile-hero-actions">
              <button type="button" class="profile-btn profile-btn--outline" id="profile-edit-btn">
                <i class="fa-solid fa-pen" aria-hidden="true"></i>
                <span>Éditer</span>
              </button>
              <button type="button" class="profile-btn profile-btn--filled" id="profile-share-btn">
                <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>

        <form class="profile-edit-panel" id="profile-edit-panel">
          <div class="profile-edit-field">
            <label for="profile-edit-name">Nom affiché</label>
            <input id="profile-edit-name" type="text" value="${profile.displayName}" />
          </div>
          <div class="profile-edit-field">
            <label for="profile-edit-position">Poste</label>
            <input id="profile-edit-position" type="text" value="${profile.position}" />
          </div>
          <div class="profile-edit-field">
            <label for="profile-edit-number">Numéro</label>
            <input id="profile-edit-number" type="text" value="${profile.number}" maxlength="2" />
          </div>
          <div class="profile-edit-field">
            <label for="profile-edit-avatar">Avatar (URL)</label>
            <input id="profile-edit-avatar" type="text" value="${profile.avatarUrl}" />
          </div>
          <div class="profile-edit-actions">
            <button type="button" class="profile-edit-cancel" id="profile-edit-cancel">Annuler</button>
            <button type="submit" class="profile-edit-save">Enregistrer</button>
          </div>
        </form>

        <div class="profile-section">
          <div class="profile-section-header">
            <i class="fa-solid fa-chart-simple" aria-hidden="true"></i>
            <h2 class="profile-section-title">STATISTIQUES GLOBALES</h2>
          </div>

          <div class="profile-stats-grid">
            <div class="profile-stat-card">
              <span class="profile-stat-label">Matchs Joués</span>
              <span class="profile-stat-value">${profile.stats.matches}</span>
            </div>
            <div class="profile-stat-card profile-stat-card--accent">
              <span class="profile-stat-label">Titres MVP</span>
              <span class="profile-stat-value">${profile.stats.mvp}</span>
            </div>
            <div class="profile-stat-card">
              <span class="profile-stat-label">Moyenne de Points (PPG)</span>
              <span class="profile-stat-value">${profile.stats.ppg}</span>
            </div>
          </div>
        </div>

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
    </main>
  </div>
</section>
`;
}

export async function profilPage() {
  const user = getCurrentUser();
  const profile = getUserProfile(user?.id, user?.name);
  return renderProfileMarkup(user, profile);
}

export function profilEvents() {
  const user = getCurrentUser();
  if (!user) return;

  let profile = getUserProfile(user.id, user.name);
  const editPanel = document.querySelector("#profile-edit-panel");
  const editBtn = document.querySelector("#profile-edit-btn");
  const cancelBtn = document.querySelector("#profile-edit-cancel");

  const toggleEditPanel = (open) => {
    editPanel?.classList.toggle("is-open", open);
  };

  editBtn?.addEventListener("click", () => toggleEditPanel(true));
  cancelBtn?.addEventListener("click", () => toggleEditPanel(false));

  editPanel?.addEventListener("submit", (event) => {
    event.preventDefault();

    profile = {
      ...profile,
      displayName: document.querySelector("#profile-edit-name")?.value.trim() || profile.displayName,
      position: document.querySelector("#profile-edit-position")?.value.trim() || profile.position,
      number: document.querySelector("#profile-edit-number")?.value.trim() || profile.number,
      avatarUrl: document.querySelector("#profile-edit-avatar")?.value.trim() || profile.avatarUrl
    };

    saveUserProfile(user.id, profile);
    document.querySelector("#profile-display-name").textContent = profile.displayName;
    document.querySelector("#profile-position").textContent = profile.position;
    document.querySelector("#profile-number").textContent = `#${profile.number}`;
    document.querySelector("#profile-avatar").src = profile.avatarUrl;

    toggleEditPanel(false);
    showToast("Profil mis à jour.");
  });

  document.querySelector("#profile-share-btn")?.addEventListener("click", async () => {
    const shareText = `${profile.displayName} · ${profile.position} · #${profile.number}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#profil`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Profil High Five",
          text: shareText,
          url: shareUrl
        });
        showToast("Profil partagé.");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      showToast("Lien du profil copié.");
    } catch {
      showToast("Impossible de partager le profil.", { type: "error" });
    }
  });
}
