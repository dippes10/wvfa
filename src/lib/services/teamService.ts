import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Client = SupabaseClient<Database>;
export type Team = Database["public"]["Tables"]["teams"]["Row"];

export async function listTeams(supabase: Client): Promise<Team[]> {
  const { data, error } = await supabase.from("teams").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function createTeam(supabase: Client, name: string) {
  const { error } = await supabase.from("teams").insert({ name });
  if (error) throw error;
}

export async function deleteTeam(supabase: Client, id: string) {
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) throw error;
}

export async function assignPlayerTeam(supabase: Client, playerId: string, teamId: string | null) {
  const { error } = await supabase.from("profiles").update({ team_id: teamId }).eq("id", playerId);
  if (error) throw error;
}
