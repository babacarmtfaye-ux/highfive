import { navigate } from "./router.js";
import { ensureUsersSeeded } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  // démarrage
  await ensureUsersSeeded();
  const initialPage = window.location.hash.replace("#", "") || "login";
  navigate(initialPage);

  // fallback pour navigation depuis des pages non connectées à window.navigate
  window.addEventListener('app:navigate', (e) => {
    const page = e?.detail?.page;
    if (page) navigate(page);
  });
});
