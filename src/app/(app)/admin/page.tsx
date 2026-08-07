import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listActivePlayers, listPendingProfiles } from "@/lib/services/userService";
import { listLoadEntriesForPlayers, type LoadEntry } from "@/lib/services/loadService";
import { listSleepEntriesForPlayers } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const [players, pending, settings] = await Promise.all([
    listActivePlayers(supabase),
    listPendingProfiles(supabase),
    getSettings(supabase),
  ]);

  const playerIds = players.map((p) => p.id);
  const [loadEntries, sleepEntries] = await Promise.all([
    listLoadEntriesForPlayers(supabase, playerIds, 30),
    listSleepEntriesForPlayers(supabase, playerIds, 30),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const entriesToday =
    loadEntries.filter((e) => e.activity_date === today).length +
    sleepEntries.filter((e) => e.entry_date === today).length;

  const byPlayer = new Map<string, LoadEntry[]>();
  for (const e of loadEntries) {
    const arr = byPlayer.get(e.player_id) ?? [];
    arr.push(e);
    byPlayer.set(e.player_id, arr);
  }
  const flagged = players
    .map((player) => ({ player, risk: computeLoadRisk(byPlayer.get(player.id) ?? [], settings) }))
    .filter((r) => r.risk.isFlagged);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">📊 Academy Overview</h1>
        <p className="text-muted-foreground">Western Victoria Football Academy — live snapshot</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active players
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{players.length}</CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entries today
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{entriesToday}</CardContent>
        </Card>
        <Link href="/admin/users" className="block">
          <Card className="h-full rounded-3xl border-2 transition-colors hover:border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{pending.length}</CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">Academy-wide load (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadChart entries={loadEntries} />
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
            <ul className="space-y-2">
              {flagged.map(({ player, risk }) => (
                <li key={player.id}>
                  <Link
                    href={`/admin/players/${player.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 transition-colors hover:bg-muted"
                  >
                    <span className="font-medium">{player.full_name ?? player.email}</span>
                    <span className="flex gap-2">
                      {risk.overHardSessionLimit && (
                        <Badge variant="destructive">{risk.hardSessionCount7d} hard sessions</Badge>
                      )}
                      {risk.sequentialHardDays && (
                        <Badge variant="destructive">Back-to-back hard days</Badge>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
