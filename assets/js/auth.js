const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const DB_URL = new URL("../data/db.json", import.meta.url);

let dbUsersPromise = null;

function readUsersFromStorage() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(stored) ? sanitizeUsers(stored) : [];
  } catch {
    return [];
  }
}

function writeUsersToStorage(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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

function mergeUsers(primaryUsers, fallbackUsers) {
  const merged = [];
  const seenEmails = new Set();

  for (const user of [...sanitizeUsers(primaryUsers), ...sanitizeUsers(fallbackUsers)]) {
    const email = normalizeEmail(user?.email);
    if (!email || seenEmails.has(email)) {
      continue;
    }

    merged.push({
      id: user.id,
      name: String(user.name || "").trim(),
      email,
      password: String(user.password || "")
    });
    seenEmails.add(email);
  }

  return merged;
}

async function loadDbUsers() {
  if (!dbUsersPromise) {
    dbUsersPromise = fetch(DB_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Impossible de charger ${DB_URL}`);
        }

        return response.json();
      })
      .then((data) => (Array.isArray(data?.users) ? data.users : []))
      .catch(() => []);
  }

  return dbUsersPromise;
}

export async function ensureUsersSeeded() {
  const storedUsers = readUsersFromStorage();
  const dbUsers = await loadDbUsers();
  const mergedUsers = mergeUsers(storedUsers, dbUsers);

  if (mergedUsers.length !== storedUsers.length) {
    writeUsersToStorage(mergedUsers);
  }

  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  if (currentUser) {
    try {
      const parsedCurrentUser = JSON.parse(currentUser);
      const currentEmail = normalizeEmail(parsedCurrentUser?.email);
      const currentUserIsValid = Boolean(currentEmail && mergedUsers.some((user) => normalizeEmail(user.email) === currentEmail));

      if (!currentUserIsValid) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  return mergedUsers;
}

export async function getUsers() {
  const storedUsers = readUsersFromStorage();

  if (storedUsers.length > 0) {
    const dbUsers = await loadDbUsers();
    const mergedUsers = mergeUsers(storedUsers, dbUsers);

    if (mergedUsers.length !== storedUsers.length) {
      writeUsersToStorage(mergedUsers);
    }

    return mergedUsers;
  }

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

  const nextUsers = [...users, nextUser];
  writeUsersToStorage(nextUsers);

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

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));

  return { ok: true, user: matchedUser };
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}