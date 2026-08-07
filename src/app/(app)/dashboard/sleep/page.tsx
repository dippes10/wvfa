import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listSleepEntries } from "@/lib/services/sleepService";
import { removeSleepEntry } from "@/lib/actions/sleep-actions";
import { SleepEntryForm } from "@/components/forms/sleep-entry-form";
import { SleepChart } from "@/components/charts/sleep-chart";
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

export default async function SleepHistoryPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const entries = await listSleepEntries(supabase, profile.id, 60);
  const sorted = [...entries].sort((a, b) => b.entry_date.localeCompare(a.entry_date));

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <h1 className="text-2xl font-bold">😴 Sleep</h1>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Log last night</CardTitle>
        </CardHeader>
        <CardContent>
          <SleepEntryForm />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Last 60 days</CardTitle>
        </CardHeader>
        <CardContent>
          <SleepChart entries={entries} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">No nights logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.entry_date}</TableCell>
                      <TableCell>{entry.duration_hours}h</TableCell>
                      <TableCell>{entry.quality}/10</TableCell>
                      <TableCell>
                        <form action={removeSleepEntry.bind(null, entry.id)}>
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
