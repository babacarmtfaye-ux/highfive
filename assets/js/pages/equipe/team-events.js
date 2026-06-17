import { getCurrentUser, getUsers } from "../../auth.js";
import { getDefaultDraft, cloneDraft, deployFranchise, getFranchises, getTakenPlayerIds, loadDraft, mergeDraftWithFranchise } from "./equipe-data.js";
import { saveTeamDraft, showToast } from "../../user-data.js";
import { MAX_ROSTER, MIN_ROSTER, FRANCHISES_URL } from "./equipe-constants.js";
import { userToPlayer } from "./equipe-players.js";
import { renderDraftModalOptions } from "./equipe-render.js";

export async function teamEvents() {
  const user = getCurrentUser();
  // Protection de rôle : seuls les Coachs peuvent exécuter des actions de gestion
  if (!user || user.role !== "coach") return;

  const franchises = await getFranchises();
  const existingFranchise = franchises.find((franchise) => String(franchise.ownerId) === String(user.id));
  let draft = mergeDraftWithFranchise(loadDraft(user.id), existingFranchise);
  const users = await getUsers();
  const validPlayerIds = new Set(users.map((item) => String(item.id)));
  draft.rosterIds = draft.rosterIds.filter((id) => validPlayerIds.has(String(id)));
  const playerCatalog = users.map(userToPlayer);
  const pageRoot = document.querySelector(".team-page");
  if (!pageRoot) return;

  const persistDraft = () => saveTeamDraft(user.id, draft);

  const refreshPage = () => {
    persistDraft();
    window.navigate?.("equipe");
  };

  const setFeedback = (message, isError = false) => {
    const feedback = document.querySelector("#team-feedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle("is-error", isError);
  };

  const openDraftModal = () => {
    const modal = document.querySelector("#team-draft-modal");
    if (!modal) return;

    // Rendre dynamiquement les options de draft/transfert
    const modalOptionsContainer = document.querySelector("#team-draft-options");
    if (modalOptionsContainer) {
      const takenPlayerIds = getTakenPlayerIds(users, franchises);
      modalOptionsContainer.innerHTML = renderDraftModalOptions(playerCatalog, takenPlayerIds, draft.rosterIds, franchises);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeDraftModal = () => {
    const modal = document.querySelector("#team-draft-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  document.querySelector("#team-name-input")?.addEventListener("input", (event) => {
    draft.name = event.target.value.trim().toUpperCase() || "BASKUP";
    persistDraft();
  });

  document.querySelector("#team-emblem-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("L'emblème ne doit pas dépasser 5 Mo.", { type: "error" });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      draft.emblemUrl = reader.result;
      persistDraft();
      refreshPage();
      showToast("Emblème mis à jour.");
    };
    reader.readAsDataURL(file);
  });

  pageRoot.addEventListener("click", async (event) => {
    const actionEl = event.target.closest("[data-team-action]");
    if (actionEl) {
      const action = actionEl.dataset.teamAction;

      if (action === "open-draft") {
        if (draft.rosterIds.length >= MAX_ROSTER) {
          showToast(`Effectif complet (${MAX_ROSTER} joueurs max).`, { type: "error" });
          return;
        }
        openDraftModal();
        return;
      }

      if (action === "close-draft") {
        closeDraftModal();
        return;
      }

      if (action === "cancel") {
        draft = draft.deployedSnapshot ? cloneDraft(draft.deployedSnapshot) : getDefaultDraft();
        persistDraft();
        refreshPage();
        showToast("Modifications annulées.");
        return;
      }

      if (action === "deploy") {
        if (draft.rosterIds.length < MIN_ROSTER) {
          const message = `Il faut au moins ${MIN_ROSTER} joueurs pour déployer l'effectif.`;
          setFeedback(message, true);
          showToast(message, { type: "error" });
          return;
        }

        // Nettoyage : Si un joueur est drafté/transféré, on le retire des autres franchises dans la base de données
        for (const playerId of draft.rosterIds) {
          const otherFranchises = franchises.filter(f => String(f.ownerId) !== String(user.id) && f.rosterIds.map(String).includes(String(playerId)));
          for (const otherF of otherFranchises) {
            const cleanRoster = otherF.rosterIds.filter(id => String(id) !== String(playerId));
            try {
              await fetch(`${FRANCHISES_URL}/${otherF.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rosterIds: cleanRoster })
              });
            } catch (err) {
              console.error("Erreur de nettoyage de transfert sur l'autre franchise :", err);
            }
          }
        }

        const deployed = await deployFranchise(user.id, draft, existingFranchise);
        if (!deployed) {
          const message = "Impossible de déployer la franchise dans la base.";
          setFeedback(message, true);
          showToast(message, { type: "error" });
          return;
        }

        draft.deployedSnapshot = cloneDraft(draft);
        persistDraft();
        setFeedback("Effectif déployé et prêt pour le tournoi.");
        showToast(`L'effectif ${draft.name} a été déployé.`);
        // Rafraîchir pour mettre à jour la liste locale des autres franchises
        setTimeout(() => window.navigate?.("equipe"), 800);
        return;
      }
    }

    const draftPlayerBtn = event.target.closest("[data-draft-player]");
    if (draftPlayerBtn) {
      const playerId = draftPlayerBtn.dataset.draftPlayer;
      const actionType = draftPlayerBtn.dataset.actionType;

      if (!playerId || !validPlayerIds.has(String(playerId)) || draft.rosterIds.includes(playerId)) return;
      if (draft.rosterIds.length >= MAX_ROSTER) return;

      draft.rosterIds.push(playerId);
      persistDraft();
      closeDraftModal();
      refreshPage();
      if (actionType === "transfer") {
        showToast("Joueur transféré dans votre effectif (sera effectif après déploiement).");
      } else {
        showToast("Joueur ajouté à l'effectif.");
      }
      return;
    }

    const removeBtn = event.target.closest(".player-card-close");
    if (removeBtn) {
      const card = removeBtn.closest("[data-player-id]");
      const playerId = card?.dataset.playerId;
      if (!playerId) return;

      draft.rosterIds = draft.rosterIds.filter((id) => id !== playerId);
      persistDraft();
      refreshPage();
      showToast("Joueur libéré (sera effectif après déploiement).");
    }
  });

  document.querySelector("#team-draft-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "team-draft-modal") {
      closeDraftModal();
    }
  });
}
