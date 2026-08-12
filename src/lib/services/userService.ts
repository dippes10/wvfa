import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, UserRole } from "@/lib/supabase/database.types";

type Client = SupabaseClient<Database>;
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type GuardianLink = Database["public"]["Tables"]["guardians_players"]["Row"];

export async function getOwnProfile(supabase: Client): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function listAllProfiles(supabase: Client): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}

export async function listAllProfilesPage(
  supabase: Client,
  { limit = 10, offset = 0, search = "" }: { limit?: number; offset?: number; search?: string } = {},
): Promise<Page<Profile>> {
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  // Strip characters that are syntactically meaningful to PostgREST's .or() filter list.
  const q = search.trim().replace(/[,()]/g, "");
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  }
  const { data, error } = await query.range(offset, offset + limit);
  if (error) throw error;
  return { items: data.slice(0, limit), hasMore: data.length > limit };
}

export async function listPendingProfiles(supabase: Client): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listActivePlayers(supabase: Client): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "player")
    .eq("status", "active")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getProfileById(supabase: Client, id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function approveProfile(supabase: Client, userId: string, role: UserRole) {
  const { error } = await supabase
    .from("profiles")
    .update({ role, status: "active" })
    .eq("id", userId);
  if (error) throw error;
}

export async function updateProfileRole(supabase: Client, userId: string, role: UserRole) {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw error;
}

export async function setProfileStatus(
  supabase: Client,
  userId: string,
  status: Database["public"]["Enums"]["user_status"],
) {
  const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
  if (error) throw error;
}

export async function updateOwnProfile(
  supabase: Client,
  userId: string,
  patch: { full_name?: string; date_of_birth?: string | null; avatar_url?: string | null },
) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

export async function listGuardianLinks(supabase: Client): Promise<GuardianLink[]> {
  const { data, error } = await supabase.from("guardians_players").select("*");
  if (error) throw error;
  return data;
}

export async function listGuardianIdsForPlayer(supabase: Client, playerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("guardians_players")
    .select("guardian_id")
    .eq("player_id", playerId);
  if (error) throw error;
  return data.map((row) => row.guardian_id);
}

export async function listLinkedPlayerIds(supabase: Client, guardianId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("guardians_players")
    .select("player_id")
    .eq("guardian_id", guardianId);
  if (error) throw error;
  return data.map((row) => row.player_id);
}

export async function linkGuardianToPlayer(supabase: Client, guardianId: string, playerId: string) {
  const { error } = await supabase
    .from("guardians_players")
    .insert({ guardian_id: guardianId, player_id: playerId });
  if (error) throw error;
}

export async function unlinkGuardianFromPlayer(supabase: Client, guardianId: string, playerId: string) {
  const { error } = await supabase
    .from("guardians_players")
    .delete()
    .eq("guardian_id", guardianId)
    .eq("player_id", playerId);
  if (error) throw error;
}
