import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAllProfiles, listAllProfilesPage, listGuardianLinks } from "@/lib/services/userService";
import { listTeams } from "@/lib/services/teamService";
import { approveUserAction, linkGuardianAction, unlinkGuardianAction } from "@/lib/actions/admin-actions";
import { assignableRoles } from "@/lib/schemas/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/components/admin/user-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roleLabels: Record<string, string> = {
  head_admin: "Head Admin",
  parent: "Parent",
  player: "Player",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const [profiles, links, teams, usersPage] = await Promise.all([
    listAllProfiles(supabase),
    listGuardianLinks(supabase),
    listTeams(supabase),
    listAllProfilesPage(supabase),
  ]);

  const pending = profiles.filter((p) => p.status === "pending");
  const active = profiles.filter((p) => p.status === "active");
  const guardians = active.filter((p) => p.role === "parent");
  const players = active.filter((p) => p.role === "player");
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Users className="size-6 text-primary" />
          Users
        </h1>
        <p className="text-muted-foreground">Approve new sign-ups and manage roles & links.</p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">
            Pending approval {pending.length > 0 && <Badge className="ml-2">{pending.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No one is waiting on approval.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <p className="font-medium">{p.full_name ?? "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </TableCell>
                      <TableCell>
                        <form action={approveUserAction} className="flex items-center justify-end gap-2">
                          <input type="hidden" name="userId" value={p.id} />
                          <Select name="role" defaultValue="player">
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {assignableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {roleLabels[role]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="submit" size="sm" className="rounded-full">
                            Approve
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

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">All users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            currentUserId={currentUser?.id}
            teams={teams}
            initialItems={usersPage.items}
            initialHasMore={usersPage.hasMore}
          />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Guardian ↔ Player links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={linkGuardianAction} className="flex flex-wrap items-end gap-2">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Parent</p>
              <Select name="guardianId">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose a parent" />
                </SelectTrigger>
                <SelectContent>
                  {guardians.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.full_name ?? g.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Player</p>
              <Select name="playerId">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose a player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((pl) => (
                    <SelectItem key={pl.id} value={pl.id}>
                      {pl.full_name ?? pl.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="sm" className="rounded-full">
              Link
            </Button>
          </form>

          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parent</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => {
                    const guardian = profileById.get(link.guardian_id);
                    const player = profileById.get(link.player_id);
                    return (
                      <TableRow key={`${link.guardian_id}-${link.player_id}`}>
                        <TableCell className="font-medium">
                          {guardian?.full_name ?? guardian?.email ?? "Unknown"}
                        </TableCell>
                        <TableCell>{player?.full_name ?? player?.email ?? "Unknown"}</TableCell>
                        <TableCell>
                          <form
                            action={unlinkGuardianAction.bind(null, link.guardian_id, link.player_id)}
                            className="flex justify-end"
                          >
                            <Button type="submit" size="sm" variant="ghost">
                              Unlink
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
