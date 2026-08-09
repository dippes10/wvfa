"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { approveUserSchema, linkGuardianSchema } from "@/lib/schemas/user";
import { academySettingsSchema } from "@/lib/schemas/settings";
import {
  approveProfile,
  updateProfileRole,
  setProfileStatus,
  linkGuardianToPlayer,
  unlinkGuardianFromPlayer,
} from "@/lib/services/userService";
import { updateSettings } from "@/lib/services/settingsService";
import { createTeam, deleteTeam, assignPlayerTeam } from "@/lib/services/teamService";

// RLS is the real gate on every one of these (see supabase/migrations/0001_init.sql) —
// a non-admin's write is rejected by Postgres regardless of what happens here.
async function adminClient() {
  return createClient();
}

export async function approveUserAction(formData: FormData) {
  const supabase = await adminClient();
  const parsed = approveUserSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return;
  await approveProfile(supabase, parsed.data.userId, parsed.data.role);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function changeRoleAction(formData: FormData) {
  const supabase = await adminClient();
  const parsed = approveUserSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return;
  await updateProfileRole(supabase, parsed.data.userId, parsed.data.role);
  revalidatePath("/admin/users");
}

export async function deactivateUserAction(userId: string) {
  const supabase = await adminClient();
  await setProfileStatus(supabase, userId, "pending");
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function linkGuardianAction(formData: FormData) {
  const supabase = await adminClient();
  const parsed = linkGuardianSchema.safeParse({
    guardianId: formData.get("guardianId"),
    playerId: formData.get("playerId"),
  });
  if (!parsed.success) return;
  await linkGuardianToPlayer(supabase, parsed.data.guardianId, parsed.data.playerId);
  revalidatePath("/admin/users");
}

export async function unlinkGuardianAction(guardianId: string, playerId: string) {
  const supabase = await adminClient();
  await unlinkGuardianFromPlayer(supabase, guardianId, playerId);
  revalidatePath("/admin/users");
}

export async function createTeamAction(formData: FormData) {
  const supabase = await adminClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await createTeam(supabase, name);
  revalidatePath("/admin/teams");
}

export async function deleteTeamAction(id: string) {
  const supabase = await adminClient();
  await deleteTeam(supabase, id);
  revalidatePath("/admin/teams");
  revalidatePath("/admin/users");
}

export async function assignTeamAction(formData: FormData) {
  const supabase = await adminClient();
  const playerId = String(formData.get("playerId") ?? "");
  const teamId = String(formData.get("teamId") ?? "");
  if (!playerId) return;
  await assignPlayerTeam(supabase, playerId, teamId === "none" ? null : teamId);
  revalidatePath("/admin/users");
  revalidatePath("/admin/teams");
}

export interface SettingsActionState {
  error: string | null;
  success?: boolean;
}

export async function updateSettingsAction(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = await adminClient();
  const parsed = academySettingsSchema.safeParse({
    hardRpeThreshold: formData.get("hardRpeThreshold"),
    maxHardSessionsWeek: formData.get("maxHardSessionsWeek"),
    guidedModeAgeCutoff: formData.get("guidedModeAgeCutoff"),
    sleepTargetMinHours: formData.get("sleepTargetMinHours"),
    sleepTargetMaxHours: formData.get("sleepTargetMaxHours"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the settings." };
  }

  try {
    await updateSettings(supabase, parsed.data);
  } catch {
    return { error: "Couldn't save settings. Try again." };
  }

  revalidatePath("/admin/settings");
  return { error: null, success: true };
}
