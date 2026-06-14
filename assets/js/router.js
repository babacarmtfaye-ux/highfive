import { loginPage, loginEvents } from "./pages/login.js";
import { signupPage, signupEvents } from "./pages/signup.js";
import { dashboardPage } from "./pages/dashboard.js";
import { teamPage } from "./pages/equipe.js";
import { calendrierPage } from "./pages/calendrier.js";
import { parametresPage } from "./pages/parametres.js";

const app = document.querySelector("#app");

const pages = {
  login: loginPage,
  signup: signupPage,
  dashboard: dashboardPage,
  equipe: teamPage,
  calendrier: calendrierPage,
  parametres: parametresPage
};

export async function navigate(page) {
  if (!pages[page]) {
    console.error("Page inconnue :", page);
    return;
  }

  app.innerHTML = await pages[page]();

  const activeView = app.querySelector(".app-view");
  if (activeView) {
    activeView.classList.add("is-active");
    activeView.removeAttribute("hidden");
    activeView.setAttribute("aria-hidden", "false");
  }

  window.navigate = navigate;

  attachNavLinks();
  attachPageEvents(page);
}

function attachNavLinks() {
  document.querySelectorAll("[data-show-view]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.showView);
    });
  });
}

function attachPageEvents(page) {
  if (page === "signup") signupEvents();
  if (page === "login") loginEvents();
}