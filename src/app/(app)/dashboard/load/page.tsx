import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listLoadEntries } from "@/lib/services/loadService";
import { removeLoadEntry } from "@/lib/actions/load-actions";
import { LoadEntryForm } from "@/components/forms/load-entry-form";
import { LoadChart } from "@/components/charts/load-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function LoadHistoryPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const entries = await listLoadEntries(supabase, profile.id, 60);
  const sorted = [...entries].sort((a, b) => b.activity_date.localeCompare(a.activity_date));

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <h1 className="text-2xl font-bold">🏃 Training Load</h1>

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
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>RPE</TableHead>
                    <TableHead>Load</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.activity_date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.duration_minutes}m</TableCell>
                      <TableCell>{entry.rpe}</TableCell>
                      <TableCell className="font-medium">{entry.session_load}</TableCell>
                      <TableCell>
                        <form action={removeLoadEntry.bind(null, entry.id)}>
                          <Button variant="ghost" size="icon" type="submit" aria-label="Delete entry">
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
