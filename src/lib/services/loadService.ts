import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { LoadEntryInput } from "@/lib/schemas/load";

type Client = SupabaseClient<Database>;
export type LoadEntry = Database["public"]["Tables"]["load_entries"]["Row"];

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function createLoadEntry(supabase: Client, playerId: string, input: LoadEntryInput) {
  const { error } = await supabase.from("load_entries").insert({
    player_id: playerId,
    activity_date: input.activityDate,
    description: input.description,
    duration_minutes: input.durationMinutes,
    rpe: input.rpe,
  });
  if (error) throw error;
}

export async function listLoadEntries(
  supabase: Client,
  playerId: string,
  sinceDays = 30,
): Promise<LoadEntry[]> {
  const { data, error } = await supabase
    .from("load_entries")
    .select("*")
    .eq("player_id", playerId)
    .gte("activity_date", isoDateDaysAgo(sinceDays))
    .order("activity_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listLoadEntriesForPlayers(
  supabase: Client,
  playerIds: string[],
  sinceDays = 30,
): Promise<LoadEntry[]> {
  if (playerIds.length === 0) return [];
  const { data, error } = await supabase
    .from("load_entries")
    .select("*")
    .in("player_id", playerIds)
    .gte("activity_date", isoDateDaysAgo(sinceDays))
    .order("activity_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function deleteLoadEntry(supabase: Client, id: string) {
  const { error } = await supabase.from("load_entries").delete().eq("id", id);
  if (error) throw error;
}
