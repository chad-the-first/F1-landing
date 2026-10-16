"use client";

import { useSyncExternalStore } from "react";

export const TEAM_IDS = ["mclaren", "ferrari", "redbull"] as const;
export type TeamId = (typeof TEAM_IDS)[number];
export const DEFAULT_TEAM: TeamId = "mclaren";

const isTeam = (v: unknown): v is TeamId => TEAM_IDS.includes(v as TeamId);

// The chosen team lives on <html data-team>, which drives the colour theme in globals.css.
// An inline script in the layout restores it from localStorage before first paint.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): TeamId {
  const t = document.documentElement.dataset.team;
  return isTeam(t) ? t : DEFAULT_TEAM;
}

export function setTeam(team: TeamId) {
  document.documentElement.dataset.team = team;
  try {
    localStorage.setItem("team", team);
  } catch {}
  listeners.forEach((l) => l());
}

export function useTeam() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_TEAM);
}

export const restoreTeamScript = `try{var t=localStorage.getItem("team");if(${JSON.stringify(TEAM_IDS)}.indexOf(t)>-1)document.documentElement.dataset.team=t}catch(e){}`;
