import { redirect } from "next/navigation";
import { MoonStar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listSleepEntries, listSleepEntriesHistoryPage } from "@/lib/services/sleepService";
import { SleepEntryForm } from "@/components/forms/sleep-entry-form";
import { SleepChart } from "@/components/charts/sleep-chart";
import { SleepHistoryTable } from "@/components/dashboard/sleep-history-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SleepHistoryPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const [entries, historyPage] = await Promise.all([
    listSleepEntries(supabase, profile.id, 60),
    listSleepEntriesHistoryPage(supabase, profile.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <MoonStar className="size-6 text-primary" />
        Sleep
      </h1>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Log last night</CardTitle>
        </CardHeader>
        <CardContent>
          <SleepEntryForm />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Last 60 days</CardTitle>
        </CardHeader>
        <CardContent>
          <SleepChart entries={entries} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          <SleepHistoryTable
            playerId={profile.id}
            initialItems={historyPage.items}
            initialHasMore={historyPage.hasMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}
