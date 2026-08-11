import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { listOwnTestimonials } from "@/lib/services/testimonialService";
import { ProfileForm } from "@/components/forms/profile-form";
import { TestimonialForm } from "@/components/forms/testimonial-form";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roleLabels: Record<string, string> = {
  head_admin: "Head Admin",
  parent: "Parent",
  player: "Player",
};

const testimonialStatusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  const ownTestimonials = await listOwnTestimonials(supabase, profile.id);

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-24 sm:p-6">
      <ProfileHeader profile={profile} />
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Share a testimonial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TestimonialForm defaultDesignation={roleLabels[profile.role] ?? "Player"} />
          {ownTestimonials.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-sm font-medium text-muted-foreground">Your submissions</p>
              <ul className="space-y-2">
                {ownTestimonials.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-start justify-between gap-3 rounded-xl border p-3 text-sm"
                  >
                    <p className="line-clamp-2 text-muted-foreground">{t.quote}</p>
                    <Badge variant={testimonialStatusVariant[t.status]} className="shrink-0">
                      {t.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
