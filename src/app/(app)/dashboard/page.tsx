import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, CircleCheck, Flame, MoonStar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listLoadEntries } from "@/lib/services/loadService";
import { listSleepEntries } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { computeStreak } from "@/lib/analysis/streak";
import { listTeams } from "@/lib/services/teamService";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { RiskGauge } from "@/components/charts/risk-gauge";
import { WeeklyTrendsPanel } from "@/components/charts/weekly-trends-panel";
import { PlayerSceneLoader } from "@/components/scenes/player-scene-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CometCard } from "@/components/ui/comet-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const [loadEntries, sleepEntries, settings, teams] = await Promise.all([
    listLoadEntries(supabase, profile.id, 60),
    listSleepEntries(supabase, profile.id, 30),
    getSettings(supabase),
    listTeams(supabase),
  ]);
  const team = teams.find((t) => t.id === profile.team_id);

  const risk = computeLoadRisk(loadEntries, settings);
  const streak = computeStreak([
    ...loadEntries.map((e) => e.activity_date),
    ...sleepEntries.map((e) => e.entry_date),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const loggedLoadToday = loadEntries.some((e) => e.activity_date === today);
  const loggedSleepToday = sleepEntries.some((e) => e.entry_date === today);
  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  const chartWindowStart = new Date();
  chartWindowStart.setDate(chartWindowStart.getDate() - 21);
  const chartWindowStartIso = chartWindowStart.toISOString().slice(0, 10);
  const recentLoadEntries = loadEntries.filter((e) => e.activity_date >= chartWindowStartIso);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Hey {firstName}</h1>
            {team && <Badge variant="secondary">{team.name}</Badge>}
          </div>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            {streak > 0 ? (
              <>
                <Flame className="size-4 text-primary" />
                {streak}-day logging streak
              </>
            ) : (
              "Log today to start a streak!"
            )}
          </p>
        </div>
        <PlayerSceneLoader celebrate={streak >= 3 && !risk.isFlagged} />
      </div>

      <Card className="rounded-3xl">
        <CardContent className="flex flex-wrap items-center justify-center gap-6 py-2 sm:justify-between">
          <RiskGauge
            value={risk.hardSessionCount7d}
            max={settings.max_hard_sessions_week}
            title="Hard sessions this week"
            caption={risk.isFlagged ? "Take it easy — recovery needed" : "You're on track"}
          />
          {risk.isFlagged && (
            <p className="max-w-xs text-center text-sm text-muted-foreground sm:text-left">
              {risk.overHardSessionLimit &&
                `${risk.hardSessionCount7d} hard sessions logged this week. `}
              {risk.sequentialHardDays && "Two hard days in a row — make sure to recover. "}
              Try to avoid another hard session until you&apos;ve had a recovery day.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Weekly trends</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyTrendsPanel entries={loadEntries} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/load" className="block">
          <CometCard className="h-full">
            <Card className="h-full rounded-3xl border-2 transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    Training Load
                  </span>
                  <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    {loggedLoadToday && <CircleCheck className="size-3.5 text-primary" />}
                    {loggedLoadToday ? "Logged today" : "Not logged yet"}
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
                  <span className="flex items-center gap-2">
                    <MoonStar className="size-4 text-primary" />
                    Sleep
                  </span>
                  <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    {loggedSleepToday && <CircleCheck className="size-3.5 text-primary" />}
                    {loggedSleepToday ? "Logged today" : "Not logged yet"}
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
            <CardTitle className="text-base">Load — last 3 weeks</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadChart entries={recentLoadEntries} />
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
