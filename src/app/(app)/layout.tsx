import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { AppNav } from "@/components/nav/app-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav role={profile.role} fullName={profile.full_name} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
