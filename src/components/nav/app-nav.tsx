import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { UserRole } from "@/lib/supabase/database.types";

const NAV_BY_ROLE: Record<UserRole, { href: string; label: string }[]> = {
  player: [
    { href: "/dashboard", label: "Home" },
    { href: "/dashboard/load", label: "Load" },
    { href: "/dashboard/sleep", label: "Sleep" },
  ],
  parent: [{ href: "/parent", label: "My Children" }],
  head_admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/settings", label: "Settings" },
  ],
};

export function AppNav({ role, fullName }: { role: UserRole; fullName: string | null }) {
  const links = NAV_BY_ROLE[role];

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <Link href={links[0]?.href ?? "/"} className="flex shrink-0 items-center gap-2 font-bold">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-lg">
            ⚽
          </span>
          <span className="hidden sm:inline">WVFA</span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/profile"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {fullName ?? "Profile"}
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
