const API_BASE_URL = "http://localhost:3001";
const USERS_URL = `${API_BASE_URL}/users`;

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
      password: String(user.password || "")
    }));
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
    password: String(user.password)
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

  return { ok: true, user: nextUser };
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

  currentUser = matchedUser;

  return { ok: true, user: matchedUser };
}

export function clearCurrentUser() {
  currentUser = null;
}