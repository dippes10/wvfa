"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href === "/admin" && pathname.startsWith("/admin/players"));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                style={{ boxShadow: "0 0 18px -3px var(--primary)" }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
