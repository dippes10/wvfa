"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Shield,
  TriangleAlert,
  MessageSquareQuote,
  Settings,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { AdminSidebarLink } from "@/components/nav/admin-sidebar-link";
import { BrandMark } from "@/components/fx/brand-mark";
import { ThemeToggle } from "@/components/fx/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/teams", label: "Teams", icon: Shield },
  { href: "/admin/alerts", label: "Alerts", icon: TriangleAlert },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebarContent({ name }: { name: string }) {
  const { open, animate } = useSidebar();
  const labelAnimate = {
    display: animate ? (open ? "inline-block" : "none") : "inline-block",
    opacity: animate ? (open ? 1 : 0) : 1,
  };

  return (
    <>
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Link href="/admin" className="flex items-center gap-2 px-2 py-2 font-bold">
          <BrandMark className="size-8 shrink-0" iconClassName="size-4" />
          <motion.span animate={labelAnimate} className="!m-0 !p-0 whitespace-pre">
            WVFA Admin
          </motion.span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {ADMIN_LINKS.map((link) => (
            <AdminSidebarLink key={link.href} {...link} />
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <Link
          href="/profile"
          className="flex items-center gap-2 px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <motion.span animate={labelAnimate} className="!m-0 truncate !p-0 whitespace-pre">
            {name}
          </motion.span>
        </Link>
        <div className="flex items-center gap-2 px-2">
          <ThemeToggle />
          <motion.div animate={labelAnimate}>
            <SignOutButton />
          </motion.div>
        </div>
      </div>
    </>
  );
}
