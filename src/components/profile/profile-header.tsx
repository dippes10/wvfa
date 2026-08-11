import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/services/userService";

const roleLabels: Record<Profile["role"], string> = {
  head_admin: "Head Admin",
  parent: "Parent",
  player: "Player",
};

export function ProfileHeader({
  profile,
  className,
  children,
}: {
  profile: Profile;
  className?: string;
  children?: React.ReactNode;
}) {
  const initial = (profile.full_name ?? profile.email)[0]?.toUpperCase();
  const memberSince = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-card", className)}>
      <div className="h-28 bg-metallic-gold sm:h-36" />
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:p-6">
        <Avatar className="-mt-14 size-20 shrink-0 border-4 border-card shadow-lg sm:-mt-16 sm:size-24">
          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{profile.full_name ?? "Unnamed"}</h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{roleLabels[profile.role]}</Badge>
            <Badge variant={profile.status === "active" ? "default" : "outline"}>
              {profile.status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          Member since {memberSince}
        </span>
        {children}
      </div>
    </div>
  );
}
