import { getCurrentUser, getUsers } from "../../auth.js";
import { getFranchises, getTakenPlayerIds, loadDraft, mergeDraftWithFranchise } from "./equipe-data.js";
import { userToPlayer } from "./equipe-players.js";
import { renderTeamMarkup, renderPlayerViewMarkup } from "./equipe-render.js";

export async function teamPage() {
  const user = getCurrentUser();
  const franchises = await getFranchises();
  const users = await getUsers();
  const playerCatalog = users.map(userToPlayer);

  // Vérifier le rôle de l'utilisateur
  if (user?.role === "coach") {
    const existingFranchise = franchises.find((franchise) => String(franchise.ownerId) === String(user?.id));
    const draft = mergeDraftWithFranchise(loadDraft(user?.id), existingFranchise);
    
    const validPlayerIds = new Set(users.map((item) => String(item.id)));
    draft.rosterIds = draft.rosterIds.filter((id) => validPlayerIds.has(String(id)));
    
    const takenPlayerIds = getTakenPlayerIds(users, franchises);
    const availablePlayers = playerCatalog.filter((player) => !takenPlayerIds.has(String(player.id)));

    return renderTeamMarkup(draft, playerCatalog, availablePlayers, franchises, user?.id);
  } else {
    // Si Joueur
    const playerTeam = franchises.find(f => f.rosterIds && f.rosterIds.map(String).includes(String(user?.id)));
    return renderPlayerViewMarkup(playerTeam, franchises, playerCatalog);
  }
}
