const API_BASE_URL = "http://localhost:3001";
const USERS_URL = `${API_BASE_URL}/users`;
const SESSION_KEY = "highfive_session";

let dbUsersPromise = null;
let currentUser = null;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidUserRecord(user) {
  return Boolean(normalizeEmail(user?.email) && String(user?.password || "").trim());
}

function sanitizeUsers(users) {
  return users
    .filter(isValidUserRecord)
    .map((user) => ({
      id: user.id,
      name: String(user.name || "").trim(),
      email: normalizeEmail(user.email),
      password: String(user.password || ""),
      role: user.role || "joueur"
    }));
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: String(user.name || "").trim(),
    email: normalizeEmail(user.email),
    role: user.role || "joueur"
  };
}

function persistSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(toPublicUser(user)));
}

async function loadDbUsers() {
  if (!dbUsersPromise) {
    dbUsersPromise = fetch(USERS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Impossible de charger ${USERS_URL}`);
        }

        return response.json();
      })
      .then((data) => (Array.isArray(data) ? data : []))
      .catch(() => []);
  }

  return dbUsersPromise;
}

export async function ensureUsersSeeded() {
  const dbUsers = await loadDbUsers();
  return sanitizeUsers(dbUsers);
}

export async function getUsers() {
  return ensureUsersSeeded();
}

export async function registerUser(user) {
  const users = await getUsers();
  const email = normalizeEmail(user.email);

  if (!user.name || !email || !user.password) {
    return { ok: false, error: "Tous les champs sont obligatoires." };
  }

  if (users.some((existingUser) => normalizeEmail(existingUser.email) === email)) {
    return { ok: false, error: "Email déjà utilisé." };
  }

  const nextUser = {
    id: Date.now(),
    name: String(user.name).trim(),
    email,
    password: String(user.password),
    role: user.role || "joueur"
  };

  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nextUser)
  });

  if (!response.ok) {
    return { ok: false, error: "Impossible d'enregistrer le compte." };
  }

  dbUsersPromise = null;

  return { ok: true, user: nextUser };
}

export function getCurrentUser() {
  return currentUser ? { ...currentUser } : null;
}

export async function restoreSession() {
  if (currentUser) {
    return currentUser;
  }

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const stored = JSON.parse(raw);
    const users = await getUsers();
    const matchedUser = users.find((user) => String(user.id) === String(stored.id));

    if (!matchedUser || normalizeEmail(matchedUser.email) !== normalizeEmail(stored.email)) {
      clearCurrentUser();
      return null;
    }

    currentUser = toPublicUser(matchedUser);
    return currentUser;
  } catch {
    clearCurrentUser();
    return null;
  }
}

export async function authenticateUser(email, password) {
  const users = await getUsers();
  const normalizedEmail = normalizeEmail(email);
  const matchedUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail);

  if (!matchedUser) {
    return { ok: false, field: "email", error: "Cet email n'existe pas" };
  }

  if (matchedUser.password !== String(password)) {
    return { ok: false, field: "password", error: "Mot de passe incorrect" };
  }

  currentUser = toPublicUser(matchedUser);
  persistSession(matchedUser);

  return { ok: true, user: currentUser };
}

export function clearCurrentUser() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
}

export async function updateUser(userId, updates) {
  const response = await fetch(`${USERS_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    return { ok: false, error: "Impossible de mettre à jour le compte." };
  }

  const updatedUser = await response.json();

  if (currentUser && String(currentUser.id) === String(userId)) {
    currentUser = toPublicUser({ ...currentUser, ...updatedUser });
    persistSession(currentUser);
  }

  return { ok: true, user: toPublicUser(updatedUser) };
}
