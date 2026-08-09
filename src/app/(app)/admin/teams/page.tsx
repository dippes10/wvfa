import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listTeams } from "@/lib/services/teamService";
import { listActivePlayers } from "@/lib/services/userService";
import { createTeamAction, deleteTeamAction } from "@/lib/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default async function AdminTeamsPage() {
  const supabase = await createClient();
  const [teams, players] = await Promise.all([listTeams(supabase), listActivePlayers(supabase)]);

  const rosterCount = new Map<string, number>();
  for (const p of players) {
    if (!p.team_id) continue;
    rosterCount.set(p.team_id, (rosterCount.get(p.team_id) ?? 0) + 1);
  }
  const unassignedCount = players.filter((p) => !p.team_id).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Shield className="size-6 text-primary" />
          Teams
        </h1>
        <p className="text-muted-foreground">Create age-group teams and see roster sizes.</p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">New team</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeamAction} className="flex gap-2">
            <Input name="name" placeholder="e.g. U13" maxLength={40} required />
            <Button type="submit" className="rounded-full">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">All teams</CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teams yet — create one above.</p>
          ) : (
            <ul className="space-y-2">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.name}</span>
                    <Badge variant="secondary">
                      {rosterCount.get(team.id) ?? 0} player
                      {(rosterCount.get(team.id) ?? 0) === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  <form action={deleteTeamAction.bind(null, team.id)}>
                    <Button type="submit" size="sm" variant="ghost">
                      Delete
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          {unassignedCount > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              {unassignedCount} active player{unassignedCount === 1 ? "" : "s"} not yet assigned to
              a team — assign them from the Users page.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
