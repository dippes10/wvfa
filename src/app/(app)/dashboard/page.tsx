import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listLoadEntries } from "@/lib/services/loadService";
import { listSleepEntries } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { computeStreak } from "@/lib/analysis/streak";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { PlayerSceneLoader } from "@/components/scenes/player-scene-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CometCard } from "@/components/ui/comet-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const [loadEntries, sleepEntries, settings] = await Promise.all([
    listLoadEntries(supabase, profile.id, 30),
    listSleepEntries(supabase, profile.id, 30),
    getSettings(supabase),
  ]);

  const risk = computeLoadRisk(loadEntries, settings);
  const streak = computeStreak([
    ...loadEntries.map((e) => e.activity_date),
    ...sleepEntries.map((e) => e.entry_date),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const loggedLoadToday = loadEntries.some((e) => e.activity_date === today);
  const loggedSleepToday = sleepEntries.some((e) => e.entry_date === today);
  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hey {firstName} 👋</h1>
          <p className="text-muted-foreground">
            {streak > 0 ? `🔥 ${streak}-day logging streak` : "Log today to start a streak!"}
          </p>
        </div>
        <PlayerSceneLoader celebrate={streak >= 3 && !risk.isFlagged} />
      </div>

      {risk.isFlagged && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTitle>Take it easy today</AlertTitle>
          <AlertDescription>
            {risk.overHardSessionLimit &&
              `You've logged ${risk.hardSessionCount7d} hard sessions this week. `}
            {risk.sequentialHardDays && "Two hard days in a row — make sure to recover. "}
            Try to avoid another hard session until you&apos;ve had a recovery day.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/load" className="block">
          <CometCard className="h-full">
            <Card className="h-full rounded-3xl border-2 transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>🏃 Training Load</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {loggedLoadToday ? "✅ Logged today" : "Not logged yet"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Tap to log a session →</p>
              </CardContent>
            </Card>
          </CometCard>
        </Link>
        <Link href="/dashboard/sleep" className="block">
          <CometCard className="h-full">
            <Card className="h-full rounded-3xl border-2 transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>😴 Sleep</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {loggedSleepToday ? "✅ Logged today" : "Not logged yet"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Tap to log last night →</p>
              </CardContent>
            </Card>
          </CometCard>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">This week&apos;s load</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadChart entries={loadEntries} />
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Sleep trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SleepChart entries={sleepEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
