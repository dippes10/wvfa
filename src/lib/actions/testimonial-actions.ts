"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { testimonialSubmitSchema } from "@/lib/schemas/testimonial";
import { getOwnProfile } from "@/lib/services/userService";
import {
  createTestimonial,
  reviewTestimonial,
  deleteTestimonial,
} from "@/lib/services/testimonialService";
import type { ActionState } from "./load-actions";

export async function submitTestimonialAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) return { error: "You need to sign in again." };

  const parsed = testimonialSubmitSchema.safeParse({
    designation: formData.get("designation"),
    quote: formData.get("quote"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await createTestimonial(
      supabase,
      profile.id,
      profile.full_name ?? profile.email,
      parsed.data,
    );
  } catch {
    return { error: "Couldn't submit that. Try again." };
  }

  revalidatePath("/profile");
  return { error: null };
}

export async function approveTestimonialAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await reviewTestimonial(supabase, id, user.id, "approved");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function rejectTestimonialAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await reviewTestimonial(supabase, id, user.id, "rejected");
  revalidatePath("/admin/testimonials");
}

export async function removeTestimonialAction(id: string) {
  const supabase = await createClient();
  await deleteTestimonial(supabase, id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/profile");
}
