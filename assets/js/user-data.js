const PREFS_PREFIX = "highfive_prefs_";
const PROFILE_PREFIX = "highfive_profile_";
const TEAM_PREFIX = "highfive_team_";

const DEFAULT_PREFS = {
  role: "Organisateur de Tournoi",
  notifications: {
    matchUpdates: true,
    teamMessages: true
  },
  privacy: {
    profilePublic: true,
    showEmail: false
  },
  theme: "dark"
};

const DEFAULT_PROFILE = {
  displayName: "",
  position: "Ailier fort",
  number: "12",
  avatarUrl: "assets/images/kv.png",
  bio: "Joueur passionné de basketball.",
  height: "190",
  weight: "85",
  stats: {
    matches: 124,
    mvp: 15,
    ppg: 24.5
  }
};

function readStore(prefix, userId, fallback) {
  if (!userId) return { ...fallback };

  try {
    const raw = localStorage.getItem(`${prefix}${userId}`);
    if (!raw) return { ...fallback };
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return { ...fallback };
  }
}

function writeStore(prefix, userId, data) {
  if (!userId) return;
  localStorage.setItem(`${prefix}${userId}`, JSON.stringify(data));
}

export function getUserPreferences(userId) {
  return readStore(PREFS_PREFIX, userId, DEFAULT_PREFS);
}

export function saveUserPreferences(userId, prefs) {
  writeStore(PREFS_PREFIX, userId, prefs);
}

export function getUserProfile(userId, userName = "") {
  const profile = readStore(PROFILE_PREFIX, userId, DEFAULT_PROFILE);
  if (!profile.displayName && userName) {
    profile.displayName = userName.split(" ").map((part) => part[0]?.toUpperCase() || "").join("").slice(0, 8) || userName.toUpperCase();
  }
  return profile;
}

export function saveUserProfile(userId, profile) {
  writeStore(PROFILE_PREFIX, userId, profile);
}

export function getTeamDraft(userId) {
  return readStore(TEAM_PREFIX, userId, null);
}

export function saveTeamDraft(userId, draft) {
  writeStore(TEAM_PREFIX, userId, draft);
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
}

export function showToast(message, { type = "success", duration = 2600 } = {}) {
  const existing = document.querySelector(".app-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `app-toast${type === "error" ? " app-toast--error" : ""}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 200);
  }, duration);
}
