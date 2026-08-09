import Link from "next/link";
import { TriangleAlert, StickyNote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listActivePlayers } from "@/lib/services/userService";
import { listLoadEntriesForPlayers, listEntriesWithNotes } from "@/lib/services/loadService";
import { getSettings } from "@/lib/services/settingsService";
import { getFlaggedPlayers } from "@/lib/analysis/flagged-players";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminAlertsPage() {
  const supabase = await createClient();
  const [players, settings, notedEntries] = await Promise.all([
    listActivePlayers(supabase),
    getSettings(supabase),
    listEntriesWithNotes(supabase, 60),
  ]);

  const playerIds = players.map((p) => p.id);
  const loadEntries = await listLoadEntriesForPlayers(supabase, playerIds, 60);
  const flagged = getFlaggedPlayers(players, loadEntries, settings);
  const playerById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <TriangleAlert className="size-6 text-primary" />
          Alerts
        </h1>
        <p className="text-muted-foreground">
          Load-risk flags and every note players have attached to a session, in one place.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Players needing recovery
            {flagged.length > 0 && <Badge variant="destructive">{flagged.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {flagged.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nobody is currently flagged.</p>
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

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <StickyNote className="size-4" />
            Session notes (60d)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notedEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notes attached to any session in the last 60 days.
            </p>
          ) : (
            <ul className="space-y-2">
              {notedEntries.map((entry) => {
                const player = playerById.get(entry.player_id);
                return (
                  <li key={entry.id}>
                    <Link
                      href={`/admin/players/${entry.player_id}`}
                      className="block rounded-xl border p-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">
                          {player?.full_name ?? player?.email ?? "Unknown player"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.activity_date} · {entry.description}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{entry.notes}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
