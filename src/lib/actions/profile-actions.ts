"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/schemas/user";
import { updateOwnProfile } from "@/lib/services/userService";
import type { ActionState } from "./load-actions";

export async function submitProfileUpdate(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in again." };

  const parsed = profileUpdateSchema.safeParse({
    fullName: formData.get("fullName"),
    dateOfBirth: formData.get("dateOfBirth") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await updateOwnProfile(supabase, user.id, {
      full_name: parsed.data.fullName,
      date_of_birth: parsed.data.dateOfBirth || null,
    });
  } catch {
    return { error: "Couldn't save your profile. Try again." };
  }

  revalidatePath("/profile");
  return { error: null };
}
