import Link from "next/link";
import { BrandMark } from "@/components/fx/brand-mark";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#coverage", label: "Coverage" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <BrandMark className="size-8" iconClassName="size-4" />
              <span>WVFA</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Western Victoria Football Academy — training load, sleep, and recovery, tracked
              properly.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Get started
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Western Victoria Football Academy</p>
          <p>Built for players, parents, and coaches.</p>
        </div>
      </div>
    </footer>
  );
}
