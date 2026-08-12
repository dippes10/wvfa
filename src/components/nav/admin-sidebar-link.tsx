"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export function AdminSidebarLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  const pathname = usePathname();
  const { open, animate } = useSidebar();
  const isActive =
    pathname === href || (href === "/admin" && pathname.startsWith("/admin/players"));

  return (
    <Link
      href={href}
      className={cn(
        "group/sidebar flex items-center gap-2 rounded-lg px-2 py-2 transition-colors",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="!m-0 !p-0 text-sm whitespace-pre"
      >
        {label}
      </motion.span>
    </Link>
  );
}
