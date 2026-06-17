import { getCurrentUser } from "../../auth.js";
import { getUserProfile, saveUserProfile, showToast } from "../../user-data.js";

function renderProfileMarkup(user, profile, teamName) {
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
                <span class="profile-meta-dot">•</span>
                <span id="profile-team-status" style="color: var(--accent); font-weight: 700;">${teamName}</span>
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

        <form class="profile-edit-panel" id="profile-edit-panel" style="overflow-y: auto; max-height: 90vh; padding-bottom: 24px;">
          <div class="profile-edit-field">
            <label for="profile-edit-name">Nom affiché</label>
            <input id="profile-edit-name" type="text" value="${profile.displayName}" required />
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
            <label for="profile-edit-bio">Biographie</label>
            <textarea id="profile-edit-bio" style="width: 100%; height: 60px; background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); color: var(--ink); padding: 8px; font-family: inherit; font-size: 13px; resize: none; border-radius: 4px;">${profile.bio || ""}</textarea>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="profile-edit-field">
              <label for="profile-edit-height">Taille (cm)</label>
              <input id="profile-edit-height" type="number" value="${profile.height || "190"}" />
            </div>
            <div class="profile-edit-field">
              <label for="profile-edit-weight">Poids (kg)</label>
              <input id="profile-edit-weight" type="number" value="${profile.weight || "85"}" />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div class="profile-edit-field">
              <label for="profile-edit-matches">Matchs</label>
              <input id="profile-edit-matches" type="number" value="${profile.stats?.matches ?? 0}" />
            </div>
            <div class="profile-edit-field">
              <label for="profile-edit-mvp">MVP</label>
              <input id="profile-edit-mvp" type="number" value="${profile.stats?.mvp ?? 0}" />
            </div>
            <div class="profile-edit-field">
              <label for="profile-edit-ppg">PPG</label>
              <input id="profile-edit-ppg" type="number" step="0.1" value="${profile.stats?.ppg ?? 0.0}" />
            </div>
          </div>
          <div class="profile-edit-field">
            <label for="profile-edit-avatar-file">Avatar (Choisir une image locale)</label>
            <input id="profile-edit-avatar-file" type="file" accept="image/*" style="width: 100%; border: none; background: transparent; padding: 4px 0; color: var(--ink);" />
          </div>
          <div class="profile-edit-actions">
            <button type="button" class="profile-edit-cancel" id="profile-edit-cancel">Annuler</button>
            <button type="submit" class="profile-edit-save">Enregistrer</button>
          </div>
        </form>

        <div class="profile-section">
          <div class="profile-section-header">
            <i class="fa-solid fa-align-left" aria-hidden="true"></i>
            <h2 class="profile-section-title">BIOGRAPHIE & INFOS PHYSIQUES</h2>
          </div>
          <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--border-radius-lg, 8px); padding: 20px;">
            <p id="profile-bio-text" style="line-height: 1.6; margin: 0 0 16px 0; color: var(--text-primary); font-style: italic;">"${profile.bio || "Aucune biographie rédigée."}"</p>
            <div style="display: flex; gap: 40px;">
              <div>
                <span style="display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Taille</span>
                <strong id="profile-height-text" style="font-size: 18px; color: var(--text-primary);">${profile.height || "190"} cm</strong>
              </div>
              <div>
                <span style="display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Poids</span>
                <strong id="profile-weight-text" style="font-size: 18px; color: var(--text-primary);">${profile.weight || "85"} kg</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <div class="profile-section-header">
            <i class="fa-solid fa-chart-simple" aria-hidden="true"></i>
            <h2 class="profile-section-title">STATISTIQUES GLOBALES</h2>
          </div>

          <div class="profile-stats-grid">
            <div class="profile-stat-card">
              <span class="profile-stat-label">Matchs Joués</span>
              <span class="profile-stat-value" id="profile-stat-val-matches">${profile.stats?.matches ?? 0}</span>
            </div>
            <div class="profile-stat-card profile-stat-card--accent">
              <span class="profile-stat-label">Titres MVP</span>
              <span class="profile-stat-value" id="profile-stat-val-mvp">${profile.stats?.mvp ?? 0}</span>
            </div>
            <div class="profile-stat-card">
              <span class="profile-stat-label">Moyenne de Points (PPG)</span>
              <span class="profile-stat-value" id="profile-stat-val-ppg">${profile.stats?.ppg ?? 0.0}</span>
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

  let teamName = "Free Agent";
  try {
    const response = await fetch("http://localhost:3001/franchises");
    if (response.ok) {
      const franchises = await response.json();
      const userTeam = franchises.find(f => f.rosterIds && f.rosterIds.map(String).includes(String(user?.id)));
      if (userTeam) {
        teamName = `Membre de ${userTeam.name}`;
      }
    }
  } catch (err) {
    console.error("Erreur de récupération de l'équipe du joueur :", err);
  }

  return renderProfileMarkup(user, profile, teamName);
}

export function profilEvents() {
  const user = getCurrentUser();
  if (!user) return;

  let profile = getUserProfile(user.id, user.name);
  const editPanel = document.querySelector("#profile-edit-panel");
  const editBtn = document.querySelector("#profile-edit-btn");
  const cancelBtn = document.querySelector("#profile-edit-cancel");
  const fileInput = document.querySelector("#profile-edit-avatar-file");

  const toggleEditPanel = (open) => {
    editPanel?.classList.toggle("is-open", open);
  };

  editBtn?.addEventListener("click", () => toggleEditPanel(true));
  cancelBtn?.addEventListener("click", () => toggleEditPanel(false));

  let selectedAvatarBase64 = profile.avatarUrl;

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("L'image ne doit pas dépasser 5 Mo.", { type: "error" });
        fileInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        selectedAvatarBase64 = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  editPanel?.addEventListener("submit", (event) => {
    event.preventDefault();

    profile = {
      ...profile,
      displayName: document.querySelector("#profile-edit-name")?.value.trim() || profile.displayName,
      position: document.querySelector("#profile-edit-position")?.value.trim() || profile.position,
      number: document.querySelector("#profile-edit-number")?.value.trim() || profile.number,
      bio: document.querySelector("#profile-edit-bio")?.value.trim() || profile.bio,
      height: document.querySelector("#profile-edit-height")?.value.trim() || profile.height,
      weight: document.querySelector("#profile-edit-weight")?.value.trim() || profile.weight,
      avatarUrl: selectedAvatarBase64,
      stats: {
        matches: parseInt(document.querySelector("#profile-edit-matches")?.value || "0", 10),
        mvp: parseInt(document.querySelector("#profile-edit-mvp")?.value || "0", 10),
        ppg: parseFloat(document.querySelector("#profile-edit-ppg")?.value || "0.0")
      }
    };

    saveUserProfile(user.id, profile);
    
    // Update DOM elements
    const displayNameEl = document.querySelector("#profile-display-name");
    if (displayNameEl) displayNameEl.textContent = profile.displayName;

    const positionEl = document.querySelector("#profile-position");
    if (positionEl) positionEl.textContent = profile.position;

    const numberEl = document.querySelector("#profile-number");
    if (numberEl) numberEl.textContent = `#${profile.number}`;

    const avatarEl = document.querySelector("#profile-avatar");
    if (avatarEl) avatarEl.src = profile.avatarUrl;

    const bioTextEl = document.querySelector("#profile-bio-text");
    if (bioTextEl) bioTextEl.textContent = `"${profile.bio || "Aucune biographie rédigée."}"`;

    const heightTextEl = document.querySelector("#profile-height-text");
    if (heightTextEl) heightTextEl.textContent = `${profile.height || "190"} cm`;

    const weightTextEl = document.querySelector("#profile-weight-text");
    if (weightTextEl) weightTextEl.textContent = `${profile.weight || "85"} kg`;

    const matchesValEl = document.querySelector("#profile-stat-val-matches");
    if (matchesValEl) matchesValEl.textContent = profile.stats.matches;

    const mvpValEl = document.querySelector("#profile-stat-val-mvp");
    if (mvpValEl) mvpValEl.textContent = profile.stats.mvp;

    const ppgValEl = document.querySelector("#profile-stat-val-ppg");
    if (ppgValEl) ppgValEl.textContent = profile.stats.ppg;

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
