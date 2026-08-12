import { notFound } from "next/navigation";
import { Activity, MoonStar, Users2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfileById, listGuardianIdsForPlayer } from "@/lib/services/userService";
import {
  listLoadEntries,
  listLoadEntriesHistoryPage,
  countLoadEntries,
} from "@/lib/services/loadService";
import {
  listSleepEntries,
  listSleepEntriesHistoryPage,
  countSleepEntries,
} from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { listTeams } from "@/lib/services/teamService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { RiskGauge } from "@/components/charts/risk-gauge";
import { WeeklyTrendsPanel } from "@/components/charts/weekly-trends-panel";
import { LogEntryForPlayerForm } from "@/components/forms/log-entry-for-player-form";
import { LoadHistoryTable } from "@/components/dashboard/load-history-table";
import { SleepHistoryTable } from "@/components/dashboard/sleep-history-table";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    player,
    loadEntries,
    sleepEntries,
    settings,
    teams,
    loadHistoryPage,
    sleepHistoryPage,
    guardianIds,
    totalSessions,
    totalNights,
  ] = await Promise.all([
    getProfileById(supabase, id),
    listLoadEntries(supabase, id, 60),
    listSleepEntries(supabase, id, 60),
    getSettings(supabase),
    listTeams(supabase),
    listLoadEntriesHistoryPage(supabase, id),
    listSleepEntriesHistoryPage(supabase, id),
    listGuardianIdsForPlayer(supabase, id),
    countLoadEntries(supabase, id),
    countSleepEntries(supabase, id),
  ]);

  if (!player) notFound();

  const guardians = await Promise.all(guardianIds.map((gid) => getProfileById(supabase, gid)));

  const risk = computeLoadRisk(loadEntries, settings);
  const team = teams.find((t) => t.id === player.team_id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <ProfileHeader profile={player}>
        {team && <Badge variant="secondary">{team.name}</Badge>}
        <span className="flex items-center gap-1.5">
          <Activity className="size-3.5" />
          {totalSessions} sessions logged
        </span>
        <span className="flex items-center gap-1.5">
          <MoonStar className="size-3.5" />
          {totalNights} nights logged
        </span>
      </ProfileHeader>

      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="load">Load</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
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

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users2 className="size-4" />
                Linked parents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guardians.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No parent account linked to this player yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {guardians.map(
                    (g) =>
                      g && (
                        <li
                          key={g.id}
                          className="rounded-xl border border-border p-3 text-sm font-medium"
                        >
                          {g.full_name ?? g.email}
                        </li>
                      ),
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="load" className="space-y-6 pt-4">
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
                initialItems={loadHistoryPage.items}
                initialHasMore={loadHistoryPage.hasMore}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6 pt-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Sleep (60d)</CardTitle>
            </CardHeader>
            <CardContent>
              <SleepChart entries={sleepEntries} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Sleep history</CardTitle>
            </CardHeader>
            <CardContent>
              <SleepHistoryTable
                playerId={player.id}
                initialItems={sleepHistoryPage.items}
                initialHasMore={sleepHistoryPage.hasMore}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
