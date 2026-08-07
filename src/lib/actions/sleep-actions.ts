"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sleepEntrySchema } from "@/lib/schemas/sleep";
import { createSleepEntry, deleteSleepEntry } from "@/lib/services/sleepService";
import type { ActionState } from "./load-actions";

export async function submitSleepEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in again." };

  const parsed = sleepEntrySchema.safeParse({
    entryDate: formData.get("entryDate"),
    durationHours: formData.get("durationHours"),
    quality: formData.get("quality"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await createSleepEntry(supabase, user.id, parsed.data);
  } catch {
    return { error: "Couldn't save that night. Try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sleep");
  return { error: null };
}

export async function removeSleepEntry(id: string) {
  const supabase = await createClient();
  await deleteSleepEntry(supabase, id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sleep");
}
