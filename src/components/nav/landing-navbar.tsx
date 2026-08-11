"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/fx/theme-toggle";
import { BrandMark } from "@/components/fx/brand-mark";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#coverage", label: "Coverage" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ marginTop: scrolled ? 12 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 flex justify-center px-4"
    >
      <div
        className={cn(
          "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300",
          scrolled
            ? "border border-border bg-background/80 shadow-lg backdrop-blur-md"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BrandMark className="size-8" iconClassName="size-4" />
          <span className="hidden sm:inline">WVFA</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ size: "sm", className: "rounded-full" })}>
            Join the Academy
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
