"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loadEntrySchema } from "@/lib/schemas/load";
import { createLoadEntry, deleteLoadEntry } from "@/lib/services/loadService";

export interface ActionState {
  error: string | null;
}

export async function submitLoadEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in again." };

  const parsed = loadEntrySchema.safeParse({
    activityDate: formData.get("activityDate"),
    description: formData.get("description"),
    durationMinutes: formData.get("durationMinutes"),
    rpe: formData.get("rpe"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await createLoadEntry(supabase, user.id, parsed.data);
  } catch {
    return { error: "Couldn't save that session. Try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/load");
  return { error: null };
}

export async function removeLoadEntry(id: string) {
  const supabase = await createClient();
  await deleteLoadEntry(supabase, id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/load");
}
