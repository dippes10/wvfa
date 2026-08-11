import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/services/userService";
import { listLoadEntries, listLoadEntriesHistoryPage } from "@/lib/services/loadService";
import { listSleepEntries } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { listTeams } from "@/lib/services/teamService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { RiskGauge } from "@/components/charts/risk-gauge";
import { WeeklyTrendsPanel } from "@/components/charts/weekly-trends-panel";
import { LogEntryForPlayerForm } from "@/components/forms/log-entry-for-player-form";
import { LoadHistoryTable } from "@/components/dashboard/load-history-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminPlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [player, loadEntries, sleepEntries, settings, teams, historyPage] = await Promise.all([
    getProfileById(supabase, id),
    listLoadEntries(supabase, id, 60),
    listSleepEntries(supabase, id, 60),
    getSettings(supabase),
    listTeams(supabase),
    listLoadEntriesHistoryPage(supabase, id),
  ]);

  if (!player) notFound();

  const risk = computeLoadRisk(loadEntries, settings);
  const team = teams.find((t) => t.id === player.team_id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{player.full_name ?? player.email}</h1>
          {team && <Badge variant="secondary">{team.name}</Badge>}
        </div>
        <p className="text-muted-foreground">{player.email}</p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="flex flex-wrap items-center justify-center gap-6 py-2 sm:justify-between">
          <RiskGauge
            value={risk.hardSessionCount7d}
            max={settings.max_hard_sessions_week}
            title="Hard sessions this week"
            caption={risk.isFlagged ? "Currently flagged for recovery" : "On track"}
          />
          {risk.isFlagged && (
            <p className="max-w-xs text-center text-sm text-muted-foreground sm:text-left">
              {risk.overHardSessionLimit &&
                `${risk.hardSessionCount7d} hard sessions in the last 7 days. `}
              {risk.sequentialHardDays && "Hard sessions on back-to-back days."}
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

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Log a session for this player</CardTitle>
        </CardHeader>
        <CardContent>
          <LogEntryForPlayerForm playerId={player.id} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Load history</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadHistoryTable
            playerId={player.id}
            ownerId={player.id}
            initialItems={historyPage.items}
            initialHasMore={historyPage.hasMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}
