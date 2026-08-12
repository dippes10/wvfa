"use server";

import { createClient } from "@/lib/supabase/server";
import { listLoadEntriesHistoryPage, listEntriesWithNotesPage } from "@/lib/services/loadService";
import { listSleepEntriesHistoryPage } from "@/lib/services/sleepService";
import { listAllProfilesPage } from "@/lib/services/userService";
import { listReviewedTestimonialsPage } from "@/lib/services/testimonialService";

export async function loadMoreLoadEntriesAction(playerId: string, offset: number) {
  const supabase = await createClient();
  return listLoadEntriesHistoryPage(supabase, playerId, { offset });
}

export async function loadMoreSleepEntriesAction(playerId: string, offset: number) {
  const supabase = await createClient();
  return listSleepEntriesHistoryPage(supabase, playerId, { offset });
}

export async function loadMoreNotedEntriesAction(offset: number) {
  const supabase = await createClient();
  return listEntriesWithNotesPage(supabase, { offset });
}

export async function loadMoreUsersAction(offset: number, search: string) {
  const supabase = await createClient();
  return listAllProfilesPage(supabase, { offset, search });
}

export async function loadMoreReviewedTestimonialsAction(offset: number) {
  const supabase = await createClient();
  return listReviewedTestimonialsPage(supabase, { offset });
}
