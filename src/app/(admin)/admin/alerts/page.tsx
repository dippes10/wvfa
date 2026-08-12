import Link from "next/link";
import { TriangleAlert, StickyNote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listActivePlayers } from "@/lib/services/userService";
import { listLoadEntriesForPlayers, listEntriesWithNotesPage } from "@/lib/services/loadService";
import { getSettings } from "@/lib/services/settingsService";
import { getFlaggedPlayers } from "@/lib/analysis/flagged-players";
import { NotedEntriesTable } from "@/components/admin/noted-entries-table";
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

export default async function AdminAlertsPage() {
  const supabase = await createClient();
  const [players, settings, notedPage] = await Promise.all([
    listActivePlayers(supabase),
    getSettings(supabase),
    listEntriesWithNotesPage(supabase),
  ]);

  const playerIds = players.map((p) => p.id);
  const loadEntries = await listLoadEntriesForPlayers(supabase, playerIds, 60);
  const flagged = getFlaggedPlayers(players, loadEntries, settings);
  const playersById = Object.fromEntries(players.map((p) => [p.id, p]));

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

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <StickyNote className="size-4" />
            Session notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotedEntriesTable
            playersById={playersById}
            initialItems={notedPage.items}
            initialHasMore={notedPage.hasMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}
