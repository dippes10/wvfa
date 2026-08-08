import Link from "next/link";
import { Activity, BarChart3, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { SquigglyText } from "@/components/ui/squiggly-text";
import { ThemeToggle } from "@/components/fx/theme-toggle";
import { FlowingTagline } from "@/components/fx/flowing-tagline";
import { FeatureShowcase } from "@/components/fx/feature-showcase";
import { HeroGraphic } from "@/components/fx/hero-graphic";
import { BrandMark } from "@/components/fx/brand-mark";
import { LandingGlobeLoader } from "@/components/scenes/landing-globe-loader";

const FEATURES = [
  {
    icon: Activity,
    title: "Training Load",
    body: "Log RPE-based sessions and get an instant heads-up before overtraining becomes an injury.",
  },
  {
    icon: MoonStar,
    title: "Sleep Analysis",
    body: "Track hours and quality with an illustrated scale kids actually enjoy filling in.",
  },
  {
    icon: BarChart3,
    title: "Admin Insights",
    body: "One live view of the whole academy — flagged players, approvals, and every entry as it lands.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <section className="relative isolate overflow-hidden bg-[oklch(0.12_0.006_90)]">
        <HeroGraphic />

        <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-2 font-bold text-white">
            <BrandMark className="size-8" iconClassName="size-4" />
            <span>WVFA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white">
              Sign in
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pt-6 pb-20 text-center text-white sm:pt-12 sm:pb-28">
          <LayoutTextFlip text="Track your" words={["Training Load", "Sleep", "Recovery", "Progress"]} />
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance text-white sm:text-6xl">
            <span className="text-metallic-gold">Western Victoria</span> Football{" "}
            <SquigglyText>Academy</SquigglyText>
          </h1>
          <p className="max-w-md text-lg text-white/70">
            Stay injury-free and see your progress — built for WVFA players, parents, and admins.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shine-sweep bg-metallic-gold rounded-full border-0 px-8 text-base font-semibold shadow-lg shadow-black/40",
            )}
          >
            Get started
          </Link>
        </div>
      </section>

      <FlowingTagline />

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Everything the academy needs
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <CometCard key={feature.title} className="w-full">
                <div className="flex h-full w-full flex-col gap-4 rounded-2xl border-2 border-border bg-card p-6 text-left shadow-md">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.body}</p>
                </div>
              </CometCard>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/40 px-6 py-16">
        <FeatureShowcase />
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Proudly serving Western Victoria
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Ballarat · Geelong · Warrnambool · Colac · Hamilton · Ararat
        </p>
        <div className="mt-8">
          <LandingGlobeLoader />
        </div>
      </section>

      <footer className="flex flex-col items-center gap-3 border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className={buttonVariants({ size: "lg", className: "rounded-full px-8 text-base" })}
        >
          Get started
        </Link>
        <p>© {new Date().getFullYear()} Western Victoria Football Academy</p>
      </footer>
    </main>
  );
}
