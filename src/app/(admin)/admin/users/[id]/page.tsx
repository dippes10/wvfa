import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Users2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfileById, listLinkedPlayerIds } from "@/lib/services/userService";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getProfileById(supabase, id);
  if (!profile) notFound();

  // Players get the full training-data view instead of this generic profile.
  if (profile.role === "player") redirect(`/admin/players/${profile.id}`);

  let linkedPlayers: Awaited<ReturnType<typeof getProfileById>>[] = [];
  if (profile.role === "parent") {
    const playerIds = await listLinkedPlayerIds(supabase, profile.id);
    linkedPlayers = await Promise.all(playerIds.map((pid) => getProfileById(supabase, pid)));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6">
      <ProfileHeader profile={profile} />

      {profile.role === "parent" && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users2 className="size-4" />
              Linked children
            </CardTitle>
          </CardHeader>
          <CardContent>
            {linkedPlayers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No players linked to this parent yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {linkedPlayers.map(
                  (player) =>
                    player && (
                      <li key={player.id}>
                        <Link
                          href={`/admin/players/${player.id}`}
                          className="flex items-center justify-between gap-2 rounded-xl border p-3 text-sm transition-colors hover:bg-muted"
                        >
                          <span className="font-medium">{player.full_name ?? player.email}</span>
                          <Badge variant="secondary">View training data</Badge>
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {profile.role === "head_admin" && (
        <Card className="rounded-3xl">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Full administrator access to the academy platform.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
