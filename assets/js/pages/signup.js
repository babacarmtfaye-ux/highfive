import { registerUser } from "../auth.js";

export function signupPage() {
    return `
<section class="app-view signup-page" data-view="signup" aria-label="Inscription High Five">
    <div class="signup-shell">
        <form class="signup-card" data-auth-form="signup">
            <header class="signup-header">
                <h1>HIGH FIVE</h1>
                <h2>REJOINDRE LA LIGUE</h2>
                <p>Créez votre compte pour accéder aux tournois.</p>
            </header>
            <div class="signup-form">
                <div class="signup-field-group"> <label for="full-name">NOM COMPLET</label>
                    <div class="signup-field"> <span class="signup-icon user-icon" aria-hidden="true"></span> <input
                            id="full-name" name="full-name" type="text" placeholder="Ex: LeBron James"
                            autocomplete="name"> </div>
                <small class="error-message" id="signup-name-error"></small>
                </div>
                <div class="signup-field-group"> <label for="signup-email">ADRESSE E-MAIL</label>
                    <div class="signup-field"> <span class="signup-icon mail-icon" aria-hidden="true"></span> <input
                            id="signup-email" name="email" type="email" placeholder="joueur@equipe.com"
                            autocomplete="email"> </div>
                <small class="error-message" id="signup-email-error"></small>
                </div>
                <div class="signup-field-group"> <label for="signup-password">MOT DE PASSE</label>
                    <div class="signup-field"> <span class="signup-icon lock-icon" aria-hidden="true"></span> <input
                            id="signup-password" name="password" type="password" placeholder="••••••••"
                            autocomplete="new-password"> </div>
                <small class="error-message" id="signup-password-error"></small>
                </div>
                <div class="signup-field-group"> <label for="confirm-password">CONFIRMER LE MOT DE PASSE</label>
                    <div class="signup-field"> <span class="signup-icon refresh-icon" aria-hidden="true"></span> <input
                            id="confirm-password" name="confirm-password" type="password" placeholder="••••••••"
                            autocomplete="new-password"> </div>
                <small class="error-message" id="signup-confirm-error"></small>
                </div> <label class="terms-row"> <input type="checkbox" name="terms"> <span>J'accepte les <a
                            href="#">conditions d'utilisation</a> et la <a href="#">politique de
                            confidentialité</a>.</span> </label> <button class="signup-button" type="submit">
                    <span>S'INSCRIRE</span> <span aria-hidden="true">→</span> </button>
              <small class="error-message" id="signup-terms-error" aria-live="polite"></small>
            </div>
            <footer class="signup-footer"> <span>Déjà un compte ?</span> <a href="#login" data-show-view="login">Se
                    connecter</a> </footer>
        </form>
    </div>
</section>
`;
}

export function signupEvents() {
  const form = document.querySelector('[data-auth-form="signup"]');
  if (!form) return;

  const emailInput = document.querySelector("#signup-email");
  const nameInput = document.querySelector("#full-name");
  const passwordInput = document.querySelector("#signup-password");
  const confirmInput = document.querySelector("#confirm-password");
  const termsInput = document.querySelector('[name="terms"]');

  const nameError = document.querySelector("#signup-name-error");
  const emailError = document.querySelector("#signup-email-error");
  const passwordError = document.querySelector("#signup-password-error");
  const confirmError = document.querySelector("#signup-confirm-error");
  const termsError = document.querySelector("#signup-terms-error");

  if (!emailInput || !nameInput || !passwordInput || !confirmInput || !termsInput) return;

  const clearErrors = () => {
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    termsError.textContent = "";
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    clearErrors();

    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const acceptedTerms = termsInput.checked;

    if (!name) {
      nameError.textContent = "Le nom est obligatoire";
    }

    if (!email) {
      emailError.textContent = "L'email est obligatoire";
    }

    if (!password) {
      passwordError.textContent = "Le mot de passe est obligatoire";
    }

    if (!confirmPassword) {
      confirmError.textContent = "Confirme le mot de passe";
    }

    if (!acceptedTerms) {
      termsError.textContent = "Tu dois accepter les conditions";
    }

    if (nameError.textContent || emailError.textContent || passwordError.textContent || confirmError.textContent || termsError.textContent) {
      return;
    }

    if (password.length < 6) {
      passwordError.textContent = "Mot de passe trop court";
      return;
    }

    if (password !== confirmPassword) {
      confirmError.textContent = "Les mots de passe ne correspondent pas";
      return;
    }

    const result = await registerUser({
      name,
      email,
      password
    });

    if (!result.ok) {
      emailError.textContent = result.error;
      return;
    }

    form.reset();

    window.navigate?.("login");
  };

  const clearOnInput = () => clearErrors();

  nameInput.oninput = clearOnInput;
  emailInput.oninput = clearOnInput;
  passwordInput.oninput = clearOnInput;
  confirmInput.oninput = clearOnInput;
  termsInput.onchange = clearOnInput;
}