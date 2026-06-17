import { getUserProfile } from "../../user-data.js";

export function splitName(name) {
  const parts = String(name || "Joueur High Five").trim().split(/\s+/);
  return {
    firstName: parts[0] || "Joueur",
    lastName: parts.slice(1).join(" ") || "High Five"
  };
}

export function userToPlayer(user) {
  const profile = getUserProfile(user.id, user.name);
  const name = splitName(user.name || profile.displayName);

  return {
    id: String(user.id),
    firstName: name.firstName,
    lastName: name.lastName,
    position: profile.position || "Joueur",
    height: profile.height ? `${profile.height} cm` : "190 cm",
    weight: profile.weight ? `${profile.weight} kg` : "85 kg",
    image: profile.avatarUrl || "assets/images/kv.png"
  };
}

export function getPlayerById(playerCatalog, id) {
  return playerCatalog.find((player) => String(player.id) === String(id));
}
