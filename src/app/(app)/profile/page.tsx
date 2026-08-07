import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { ProfileForm } from "@/components/forms/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const roleLabels: Record<string, string> = {
  head_admin: "Head Admin",
  parent: "Parent",
  player: "Player",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const initial = (profile.full_name ?? profile.email)[0]?.toUpperCase();

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-24 sm:p-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="text-xl">{initial}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">{profile.full_name ?? profile.email}</h1>
          <Badge variant="secondary">{roleLabels[profile.role]}</Badge>
        </div>
      </div>
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
