import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listLoadEntries, listLoadEntriesHistoryPage } from "@/lib/services/loadService";
import { LoadEntryForm } from "@/components/forms/load-entry-form";
import { LoadChart } from "@/components/charts/load-chart";
import { LoadHistoryTable } from "@/components/dashboard/load-history-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoadHistoryPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const [entries, historyPage] = await Promise.all([
    listLoadEntries(supabase, profile.id, 60),
    listLoadEntriesHistoryPage(supabase, profile.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Activity className="size-6 text-primary" />
        Training Load
      </h1>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Log a session</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadEntryForm />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Last 60 days</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadChart entries={entries} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadHistoryTable
            playerId={profile.id}
            ownerId={profile.id}
            initialItems={historyPage.items}
            initialHasMore={historyPage.hasMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}
