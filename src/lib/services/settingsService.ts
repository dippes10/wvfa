import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { AcademySettingsInput } from "@/lib/schemas/settings";

type Client = SupabaseClient<Database>;
export type AcademySettings = Database["public"]["Tables"]["academy_settings"]["Row"];

export async function getSettings(supabase: Client): Promise<AcademySettings> {
  const { data, error } = await supabase.from("academy_settings").select("*").single();
  if (error) throw error;
  return data;
}

export async function updateSettings(supabase: Client, input: AcademySettingsInput) {
  const { error } = await supabase
    .from("academy_settings")
    .update({
      hard_rpe_threshold: input.hardRpeThreshold,
      max_hard_sessions_week: input.maxHardSessionsWeek,
      guided_mode_age_cutoff: input.guidedModeAgeCutoff,
      sleep_target_min_hours: input.sleepTargetMinHours,
      sleep_target_max_hours: input.sleepTargetMaxHours,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);
  if (error) throw error;
}
