"use client";

import { useMemo, useState } from "react";
import {
  changeRoleAction,
  deactivateUserAction,
  assignTeamAction,
} from "@/lib/actions/admin-actions";
import { assignableRoles } from "@/lib/schemas/user";
import type { Profile } from "@/lib/services/userService";
import type { Team } from "@/lib/services/teamService";
import { GooeyInput } from "@/components/ui/gooey-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function UserTable({
  profiles,
  currentUserId,
  teams,
}: {
  profiles: Profile[];
  currentUserId: string | undefined;
  teams: Team[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) => p.full_name?.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
    );
  }, [profiles, search]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <GooeyInput
          placeholder="Search name or email..."
          value={search}
          onValueChange={setSearch}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No users match &quot;{search}&quot;.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-medium">{p.full_name ?? "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === "active" ? "default" : "secondary"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell colSpan={2}>
                    {p.status === "active" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <form action={changeRoleAction} className="flex items-center gap-2">
                          <input type="hidden" name="userId" value={p.id} />
                          <Select name="role" defaultValue={p.role}>
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
                          <Button type="submit" size="sm" variant="secondary">
                            Update
                          </Button>
                        </form>
                        {p.role === "player" && (
                          <form action={assignTeamAction} className="flex items-center gap-2">
                            <input type="hidden" name="playerId" value={p.id} />
                            <Select name="teamId" defaultValue={p.team_id ?? "none"}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Team" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No team</SelectItem>
                                {teams.map((team) => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button type="submit" size="sm" variant="secondary">
                              Set
                            </Button>
                          </form>
                        )}
                        {p.id !== currentUserId && (
                          <form action={deactivateUserAction.bind(null, p.id)}>
                            <Button type="submit" size="sm" variant="ghost">
                              Deactivate
                            </Button>
                          </form>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Awaiting approval</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
