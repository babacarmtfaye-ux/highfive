import { getTeamDraft } from "../../user-data.js";
import { DEFAULT_DRAFT, FRANCHISES_URL } from "./equipe-constants.js";

export function cloneDraft(draft) {
  return {
    ...draft,
    rosterIds: Array.isArray(draft.rosterIds) ? [...draft.rosterIds] : [],
    deployedSnapshot: draft.deployedSnapshot
      ? {
          ...draft.deployedSnapshot,
          rosterIds: Array.isArray(draft.deployedSnapshot.rosterIds) ? [...draft.deployedSnapshot.rosterIds] : []
        }
      : null
  };
}

export function getDefaultDraft() {
  return cloneDraft(DEFAULT_DRAFT);
}

export function loadDraft(userId) {
  const stored = getTeamDraft(userId);
  if (!stored) return getDefaultDraft();

  return {
    ...getDefaultDraft(),
    ...stored,
    rosterIds: Array.isArray(stored.rosterIds) ? [...stored.rosterIds] : [],
    deployedSnapshot: stored.deployedSnapshot || null
  };
}

export async function getFranchises() {
  try {
    const response = await fetch(FRANCHISES_URL);
    if (!response.ok) return [];
    const franchises = await response.json();
    return Array.isArray(franchises) ? franchises : [];
  } catch {
    return [];
  }
}

export function mergeDraftWithFranchise(draft, franchise) {
  if (!franchise) return draft;

  return {
    ...draft,
    name: draft.name === DEFAULT_DRAFT.name ? franchise.name || draft.name : draft.name,
    emblemUrl: draft.emblemUrl === DEFAULT_DRAFT.emblemUrl ? franchise.emblemUrl || draft.emblemUrl : draft.emblemUrl,
    rosterIds: draft.rosterIds.length ? draft.rosterIds : Array.isArray(franchise.rosterIds) ? [...franchise.rosterIds] : []
  };
}

export async function deployFranchise(ownerId, draft, existingFranchise) {
  const payload = {
    ownerId: String(ownerId),
    name: draft.name,
    emblemUrl: draft.emblemUrl,
    rosterIds: draft.rosterIds.map(String)
  };

  try {
    const response = await fetch(existingFranchise ? `${FRANCHISES_URL}/${existingFranchise.id}` : FRANCHISES_URL, {
      method: existingFranchise ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(existingFranchise ? payload : { id: `franchise-${ownerId}`, ...payload })
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function getStoredDraftByUserId(userId) {
  try {
    const raw = localStorage.getItem(`highfive_team_${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getTakenPlayerIds(users, franchises = []) {
  const localTakenIds = users.flatMap((user) => {
    const draft = getStoredDraftByUserId(user.id);
    return Array.isArray(draft?.rosterIds) ? draft.rosterIds.map(String) : [];
  });
  const franchiseTakenIds = franchises.flatMap((franchise) => (
    Array.isArray(franchise.rosterIds) ? franchise.rosterIds.map(String) : []
  ));

  return new Set([...localTakenIds, ...franchiseTakenIds]);
}
