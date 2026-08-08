import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getOwnProfile,
  listLinkedPlayerIds,
  getProfileById,
  type Profile,
} from "@/lib/services/userService";
import { listLoadEntries, type LoadEntry } from "@/lib/services/loadService";
import { listSleepEntries, type SleepEntry } from "@/lib/services/sleepService";
import { getSettings } from "@/lib/services/settingsService";
import { computeLoadRisk } from "@/lib/analysis/load-flags";
import { Users } from "lucide-react";
import { LoadChart } from "@/components/charts/load-chart";
import { SleepChart } from "@/components/charts/sleep-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ChildCard({
  child,
  loadEntries,
  sleepEntries,
  settings,
}: {
  child: Profile;
  loadEntries: LoadEntry[];
  sleepEntries: SleepEntry[];
  settings: Awaited<ReturnType<typeof getSettings>>;
}) {
  const risk = computeLoadRisk(loadEntries, settings);

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {child.full_name ?? child.email}
          {risk.isFlagged && <Badge variant="destructive">Needs recovery</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {risk.isFlagged && (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertTitle>Watch their load this week</AlertTitle>
            <AlertDescription>
              {risk.overHardSessionLimit &&
                `${risk.hardSessionCount7d} hard sessions logged in the last 7 days. `}
              {risk.sequentialHardDays && "Hard sessions on back-to-back days."}
            </AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Training load</p>
            <LoadChart entries={loadEntries} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Sleep</p>
            <SleepChart entries={sleepEntries} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ParentPage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const playerIds = await listLinkedPlayerIds(supabase, profile.id);
  const settings = await getSettings(supabase);

  const children = await Promise.all(
    playerIds.map(async (id) => {
      const [child, loadEntries, sleepEntries] = await Promise.all([
        getProfileById(supabase, id),
        listLoadEntries(supabase, id, 30),
        listSleepEntries(supabase, id, 30),
      ]);
      return { child, loadEntries, sleepEntries };
    }),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Users className="size-6 text-primary" />
          Your Children
        </h1>
        <p className="text-muted-foreground">
          A read-only view of training load and sleep for your linked players.
        </p>
      </div>

      {children.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No linked children yet — ask a WVFA admin to link your account to your player(s).
          </CardContent>
        </Card>
      ) : (
        children.map(
          ({ child, loadEntries, sleepEntries }) =>
            child && (
              <ChildCard
                key={child.id}
                child={child}
                loadEntries={loadEntries}
                sleepEntries={sleepEntries}
                settings={settings}
              />
            ),
        )
      )}
    </div>
  );
}
