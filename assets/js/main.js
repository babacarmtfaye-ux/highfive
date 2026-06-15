import { navigate } from "./router.js";
import { ensureUsersSeeded, getCurrentUser, restoreSession } from "./auth.js";
import { applyTheme, getUserPreferences } from "./user-data.js";

document.addEventListener("DOMContentLoaded", async () => {
  await ensureUsersSeeded();
  await restoreSession();

  const user = getCurrentUser();
  if (user) {
    applyTheme(getUserPreferences(user.id).theme);
  }

  const hashPage = window.location.hash.replace("#", "");
  const initialPage = hashPage || (getCurrentUser() ? "dashboard" : "login");
  await navigate(initialPage);

  // fallback pour navigation depuis des pages non connectées à window.navigate
  window.addEventListener('app:navigate', (e) => {
    const page = e?.detail?.page;
    if (page) navigate(page);
  });

  window.addEventListener("hashchange", () => {
    const page = window.location.hash.replace("#", "") || "login";
    if (page !== document.querySelector("#app .app-view")?.dataset.view) {
      navigate(page);
    }
  });
});
