import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TestimonialStatus } from "@/lib/supabase/database.types";
import type { TestimonialSubmitInput } from "@/lib/schemas/testimonial";

type Client = SupabaseClient<Database>;
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export async function createTestimonial(
  supabase: Client,
  authorId: string,
  authorName: string,
  input: TestimonialSubmitInput,
) {
  const { error } = await supabase.from("testimonials").insert({
    author_id: authorId,
    author_name: authorName,
    designation: input.designation,
    quote: input.quote,
  });
  if (error) throw error;
}

export async function listApprovedTestimonials(supabase: Client): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "approved")
    .order("reviewed_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listOwnTestimonials(supabase: Client, authorId: string): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listPendingTestimonials(supabase: Client): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listReviewedTestimonials(supabase: Client): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .in("status", ["approved", "rejected"])
    .order("reviewed_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function reviewTestimonial(
  supabase: Client,
  id: string,
  reviewerId: string,
  status: Extract<TestimonialStatus, "approved" | "rejected">,
) {
  const { error } = await supabase
    .from("testimonials")
    .update({ status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(supabase: Client, id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}

export async function listReviewedTestimonialsPage(
  supabase: Client,
  { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<Page<Testimonial>> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .in("status", ["approved", "rejected"])
    .order("reviewed_at", { ascending: false })
    .range(offset, offset + limit);
  if (error) throw error;
  return { items: data.slice(0, limit), hasMore: data.length > limit };
}
