import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/services/userService";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "@/components/nav/admin-sidebar-content";
import { RouteTracingBeam } from "@/components/nav/route-tracing-beam";
import { IdleSessionGuard } from "@/components/auth/idle-session-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const profile = await getOwnProfile(supabase);
  if (!profile) redirect("/login");
  if (profile.role !== "head_admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <IdleSessionGuard />
      <Sidebar>
        <SidebarBody className="justify-between gap-6">
          <AdminSidebarContent name={profile.full_name ?? profile.email} />
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 px-4 py-4 md:px-16 md:py-8">
        <RouteTracingBeam>{children}</RouteTracingBeam>
      </main>
    </div>
  );
}
