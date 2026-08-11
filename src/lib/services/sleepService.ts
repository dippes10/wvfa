import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { SleepEntryInput } from "@/lib/schemas/sleep";

type Client = SupabaseClient<Database>;
export type SleepEntry = Database["public"]["Tables"]["sleep_entries"]["Row"];

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function createSleepEntry(supabase: Client, playerId: string, input: SleepEntryInput) {
  const { error } = await supabase.from("sleep_entries").insert({
    player_id: playerId,
    entry_date: input.entryDate,
    duration_hours: input.durationHours,
    quality: input.quality,
  });
  if (error) throw error;
}

export async function listSleepEntries(
  supabase: Client,
  playerId: string,
  sinceDays = 30,
): Promise<SleepEntry[]> {
  const { data, error } = await supabase
    .from("sleep_entries")
    .select("*")
    .eq("player_id", playerId)
    .gte("entry_date", isoDateDaysAgo(sinceDays))
    .order("entry_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listSleepEntriesForPlayers(
  supabase: Client,
  playerIds: string[],
  sinceDays = 30,
): Promise<SleepEntry[]> {
  if (playerIds.length === 0) return [];
  const { data, error } = await supabase
    .from("sleep_entries")
    .select("*")
    .in("player_id", playerIds)
    .gte("entry_date", isoDateDaysAgo(sinceDays))
    .order("entry_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function deleteSleepEntry(supabase: Client, id: string) {
  const { error } = await supabase.from("sleep_entries").delete().eq("id", id);
  if (error) throw error;
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}

/** Paginated full history for one player (no date-window cutoff), newest first. */
export async function listSleepEntriesHistoryPage(
  supabase: Client,
  playerId: string,
  { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<Page<SleepEntry>> {
  const { data, error } = await supabase
    .from("sleep_entries")
    .select("*")
    .eq("player_id", playerId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit);
  if (error) throw error;
  return { items: data.slice(0, limit), hasMore: data.length > limit };
}
