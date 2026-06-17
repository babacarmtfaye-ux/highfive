import { loginPage, loginEvents } from "./pages/login/login.js";
import { signupPage, signupEvents } from "./pages/signup/signup.js";
import { dashboardPage, dashboardEvents } from "./pages/dashboard/dashboard.js";
import { teamPage, teamEvents } from "./pages/equipe/equipe.js";
import { calendrierPage } from "./pages/calendrier/calendrier.js";
import { parametresPage, parametresEvents } from "./pages/parametres/parametres.js";
import { profilPage, profilEvents } from "./pages/profil/profil.js";
import { matchLivePage } from "./pages/match-live/match-live.js";
import { clearCurrentUser, getCurrentUser } from "./auth.js";

const app = document.querySelector("#app");

const pages = {
  login: loginPage,
  signup: signupPage,
  dashboard: dashboardPage,
  equipe: teamPage,
  calendrier: calendrierPage,
  parametres: parametresPage,
  profil: profilPage,
  "match-live": matchLivePage
};

const PUBLIC_PAGES = new Set(["login", "signup"]);

let currentPage = null;

export async function navigate(page) {
  if (!pages[page]) {
    console.error("Page inconnue :", page);
    return;
  }

  const user = getCurrentUser();
  const isProtected = !PUBLIC_PAGES.has(page);

  if (isProtected && !user) {
    page = "login";
  } else if (page === "login" && user) {
    page = "dashboard";
  }

  currentPage = page;
  app.innerHTML = await pages[page]();

  const activeView = app.querySelector(".app-view");
  if (activeView) {
    activeView.classList.add("is-active");
    activeView.removeAttribute("hidden");
    activeView.setAttribute("aria-hidden", "false");
  }

  window.navigate = navigate;

  attachNavLinks();
  await attachPageEvents(page);

  if (window.location.hash.replace("#", "") !== page) {
    window.location.hash = page;
  }
}

function attachNavLinks() {
  document.querySelectorAll("[data-show-view]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      if (el.classList.contains("dashboard-logout")) {
        clearCurrentUser();
      }

      navigate(el.dataset.showView);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();

      if (el.classList.contains("dashboard-logout")) {
        clearCurrentUser();
      }

      navigate(el.dataset.showView);
    });
  });
}

async function attachPageEvents(page) {
  if (page === "signup") signupEvents();
  if (page === "login") loginEvents();
  if (page === "dashboard") dashboardEvents();
  if (page === "equipe") await teamEvents();
  if (page === "parametres") parametresEvents();
  if (page === "profil") profilEvents();
}