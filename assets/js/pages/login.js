import { authenticateUser } from "../auth.js";

export function loginPage() {
  return `
<section class="app-view is-active" data-view="login">
  <div class="split-screen">

    <section class="hero-panel">
      <div class="hero-image-slot"></div>
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1>DOMINEZ<br>LA RAQUETTE</h1>
        <p>Accédez à une gestion de tournoi avancée.</p>
      </div>
    </section>

    <section class="login-panel">
      <form class="login-card" data-auth-form="login">

        <header class="login-header">
          <div class="logo-slot">
            <img src="assets/images/logo.png" alt="Logo High Five">
          </div>
          <h2>HIGH FIVE</h2>
          <p>Accédez à une gestion de tournoi avancée.</p>
        </header>

        <div class="login-form">

        <div class="field-group">
          <label>EMAIL</label>
          <div class="field">
            <input id="email" type="email">
          </div>
          <small class="error-message" id="email-error"></small>
        </div>

        <div class="field-group">
          <label>MOT DE PASSE</label>
          <div class="field">
            <input id="password" type="password">
          </div>
          <small class="error-message" id="password-error"></small>
        </div>

        <small class="error-message" id="auth-error" aria-live="polite"></small>

        <button class="submit-button" type="submit">LOGIN</button>

        <footer class="login-footer">
          <a href="#signup" data-show-view="signup">Créer un compte</a>
        </footer>

        </div>

      </form>
    </section>

  </div>
</section>
`;
}

export function loginEvents() {
  const form = document.querySelector('[data-auth-form="login"]');

  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  const emailError = document.querySelector("#email-error");
  const passwordError = document.querySelector("#password-error");
  const authError = document.querySelector("#auth-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    emailError.textContent = "";
    passwordError.textContent = "";
    authError.textContent = "";

    emailInput.closest(".field-group").classList.remove("error");
    passwordInput.closest(".field-group").classList.remove("error");

    if (!email) {
      emailError.textContent = "Saisis ton email";
      emailInput.closest(".field-group").classList.add("error");
      return;
    }

    if (!password) {
      passwordError.textContent = "Saisis ton mot de passe";
      passwordInput.closest(".field-group").classList.add("error");
      return;
    }

    const result = await authenticateUser(email, password);

    if (!result.ok) {
      authError.textContent = result.error;

      if (result.field === "email") {
        emailError.textContent = result.error;
        emailInput.closest(".field-group").classList.add("error");
      }

      if (result.field === "password") {
        passwordError.textContent = result.error;
        passwordInput.closest(".field-group").classList.add("error");
      }

      emailInput.closest(".field-group").classList.add("error");
      return;
    }

    // navigation propre (SPA)
    window.navigate?.("dashboard");
  });

  emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    authError.textContent = "";
    emailInput.closest(".field-group").classList.remove("error");
  });

  passwordInput.addEventListener("input", () => {
    passwordError.textContent = "";
    authError.textContent = "";
    passwordInput.closest(".field-group").classList.remove("error");
  });
}