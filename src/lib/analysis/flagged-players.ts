import type { Profile } from "@/lib/services/userService";
import type { LoadEntry } from "@/lib/services/loadService";
import type { AcademySettings } from "@/lib/services/settingsService";
import { computeLoadRisk, type LoadRisk } from "./load-flags";

export interface FlaggedPlayer {
  player: Profile;
  risk: LoadRisk;
}

export function getFlaggedPlayers(
  players: Profile[],
  entries: LoadEntry[],
  settings: AcademySettings,
): FlaggedPlayer[] {
  const byPlayer = new Map<string, LoadEntry[]>();
  for (const e of entries) {
    const arr = byPlayer.get(e.player_id) ?? [];
    arr.push(e);
    byPlayer.set(e.player_id, arr);
  }

  return players
    .map((player) => ({ player, risk: computeLoadRisk(byPlayer.get(player.id) ?? [], settings) }))
    .filter((r) => r.risk.isFlagged);
}
