import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/fx/theme-toggle";
import { BrandMark } from "@/components/fx/brand-mark";
import { NavLinks, type NavLink } from "@/components/nav/nav-links";
import type { UserRole } from "@/lib/supabase/database.types";

const NAV_BY_ROLE: Record<UserRole, NavLink[]> = {
  player: [
    { href: "/dashboard", label: "Home" },
    { href: "/dashboard/load", label: "Load" },
    { href: "/dashboard/sleep", label: "Sleep" },
  ],
  parent: [{ href: "/parent", label: "My Children" }],
  head_admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/teams", label: "Teams" },
    { href: "/admin/alerts", label: "Alerts" },
    { href: "/admin/testimonials", label: "Testimonials" },
    { href: "/admin/settings", label: "Settings" },
  ],
};

export function AppNav({ role, fullName }: { role: UserRole; fullName: string | null }) {
  const links = NAV_BY_ROLE[role];

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <Link href={links[0]?.href ?? "/"} className="flex shrink-0 items-center gap-2 font-bold">
          <BrandMark className="size-8" iconClassName="size-4" />
          <span className="hidden sm:inline">WVFA</span>
        </Link>
        <NavLinks links={links} />
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/profile"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {fullName ?? "Profile"}
          </Link>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
