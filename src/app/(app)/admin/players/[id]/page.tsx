import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/services/userService";
import { listLoadEntries } from "@/lib/services/loadService";
import { listSleepEntries } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function AdminPlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [player, loadEntries, sleepEntries, settings] = await Promise.all([
    getProfileById(supabase, id),
    listLoadEntries(supabase, id, 60),
    listSleepEntries(supabase, id, 60),
    getSettings(supabase),
  ]);

  if (!player) notFound();

  const risk = computeLoadRisk(loadEntries, settings);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">{player.full_name ?? player.email}</h1>
        <p className="text-muted-foreground">{player.email}</p>
      </div>

      {risk.isFlagged && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTitle>Currently flagged</AlertTitle>
          <AlertDescription>
            {risk.overHardSessionLimit &&
              `${risk.hardSessionCount7d} hard sessions in the last 7 days. `}
            {risk.sequentialHardDays && "Hard sessions on back-to-back days."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Training load (60d)</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadChart entries={loadEntries} />
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Sleep (60d)</CardTitle>
          </CardHeader>
          <CardContent>
            <SleepChart entries={sleepEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
