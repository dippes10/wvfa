import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listActivePlayers, listPendingProfiles } from "@/lib/services/userService";
import { listLoadEntriesForPlayers } from "@/lib/services/loadService";
import { listSleepEntriesForPlayers } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { getFlaggedPlayers } from "@/lib/analysis/flagged-players";
import { LayoutDashboard, Users, CalendarCheck, UserRoundPlus, TriangleAlert } from "lucide-react";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { WeeklyTrendsPanel } from "@/components/charts/weekly-trends-panel";
import { KpiWidget } from "@/components/admin/kpi-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const [players, pending, settings] = await Promise.all([
    listActivePlayers(supabase),
    listPendingProfiles(supabase),
    getSettings(supabase),
  ]);

  const playerIds = players.map((p) => p.id);
  const [loadEntries, sleepEntries] = await Promise.all([
    listLoadEntriesForPlayers(supabase, playerIds, 60),
    listSleepEntriesForPlayers(supabase, playerIds, 30),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const entriesToday =
    loadEntries.filter((e) => e.activity_date === today).length +
    sleepEntries.filter((e) => e.entry_date === today).length;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const entriesTrend = last7Days.map(
    (date) =>
      loadEntries.filter((e) => e.activity_date === date).length +
      sleepEntries.filter((e) => e.entry_date === date).length,
  );

  const flagged = getFlaggedPlayers(players, loadEntries, settings);

  const yesterdayCount = entriesTrend[entriesTrend.length - 2] ?? 0;
  const entriesTrendPercent =
    yesterdayCount > 0 ? Math.round(((entriesToday - yesterdayCount) / yesterdayCount) * 100) : null;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString().slice(0, 10);
  const recentLoadEntries = loadEntries.filter((e) => e.activity_date >= thirtyDaysAgoIso);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <LayoutDashboard className="size-6 text-primary" />
          Academy Overview
        </h1>
        <p className="text-muted-foreground">Western Victoria Football Academy — live snapshot</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          At a glance
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiWidget icon={Users} label="Active players" value={players.length} />
          <KpiWidget
            icon={CalendarCheck}
            label="Entries today"
            value={entriesToday}
            trendPercent={entriesTrendPercent}
            sparklineData={entriesTrend}
            caption="vs. yesterday"
          />
          <Link href="/admin/users" className="block">
            <KpiWidget
              icon={UserRoundPlus}
              label="Pending approvals"
              value={pending.length}
              className="h-full transition-colors hover:border-primary"
            />
          </Link>
          <Link href="/admin/alerts" className="block">
            <KpiWidget
              icon={TriangleAlert}
              label="Players flagged"
              value={flagged.length}
              caption={flagged.length > 0 ? "Needs attention" : "All clear"}
              className="h-full transition-colors hover:border-primary"
            />
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Trends
        </h2>
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Academy-wide weekly trends</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyTrendsPanel entries={loadEntries} />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Academy-wide load (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadChart entries={recentLoadEntries} />
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Academy-wide sleep (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <SleepChart entries={sleepEntries} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Attention needed
        </h2>
        <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Players needing recovery</CardTitle>
        </CardHeader>
        <CardContent>
          {flagged.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nobody is currently flagged — nice work!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Flags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flagged.map(({ player, risk }) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Link
                          href={`/admin/players/${player.id}`}
                          className="font-medium hover:underline"
                        >
                          {player.full_name ?? player.email}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {risk.overHardSessionLimit && (
                            <Badge variant="destructive">
                              {risk.hardSessionCount7d} hard sessions
                            </Badge>
                          )}
                          {risk.sequentialHardDays && (
                            <Badge variant="destructive">Back-to-back hard days</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        </Card>
      </section>
    </div>
  );
}
