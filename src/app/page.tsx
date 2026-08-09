import Link from "next/link";
import { Activity, BarChart3, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { listApprovedTestimonials } from "@/lib/services/testimonialService";
import { buttonVariants } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { ThemeToggle } from "@/components/fx/theme-toggle";
import { HeroGraphic } from "@/components/fx/hero-graphic";
import { BrandMark } from "@/components/fx/brand-mark";
import { SectionHeading } from "@/components/fx/section-heading";
import { LandingGlobeLoader } from "@/components/scenes/landing-globe-loader";
import { TestimonialsDisplay } from "@/components/testimonials-display";
import { GALLERY_ITEMS } from "@/lib/data/gallery";

const FEATURES = [
  {
    icon: Activity,
    title: "Training Load",
    body: "RPE-based session logging with an instant heads-up before overtraining becomes an injury.",
  },
  {
    icon: MoonStar,
    title: "Sleep Analysis",
    body: "Hours and quality, tracked daily, with trends that surface what's actually changing.",
  },
  {
    icon: BarChart3,
    title: "Admin Insights",
    body: "One live view of the whole academy — flagged players, approvals, every entry as it lands.",
  },
] as const;

export default async function HomePage() {
  const supabase = await createClient();
  // Public marketing page — a testimonials fetch problem shouldn't take the whole page down.
  const testimonials = await listApprovedTestimonials(supabase).catch(() => []);

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

        <div className="relative z-10 flex flex-col items-center gap-5 px-6 pt-10 pb-24 text-center sm:pt-16 sm:pb-32">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Western Victoria Football Academy
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance text-white sm:text-6xl">
            Train <span className="text-metallic-gold">smarter</span>. Recover{" "}
            <span className="text-metallic-gold">better</span>.
          </h1>
          <p className="max-w-md text-lg text-white/65">
            Session load, sleep, and recovery — tracked properly, for players, parents, and
            coaches across the academy.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shine-sweep bg-metallic-gold mt-2 rounded-full border-0 px-8 text-base font-semibold shadow-lg shadow-black/40",
            )}
          >
            Get started
          </Link>
        </div>
      </section>

      <div className="px-4 md:px-16">
        <TracingBeam className="max-w-5xl">
          <div className="space-y-24 py-20">
            <section>
              <SectionHeading eyebrow="Platform" title="Everything the academy needs" />
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
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

            <section>
              <SectionHeading eyebrow="Gallery" title="A look inside WVFA" />
              <div className="mt-8">
                <Carousel
                  items={GALLERY_ITEMS.map((item, i) => (
                    <Card
                      key={item.title}
                      index={i}
                      layout
                      card={{
                        src: item.src,
                        title: item.title,
                        category: item.category,
                        content: (
                          <p className="text-neutral-600 dark:text-neutral-400">
                            {item.description}
                          </p>
                        ),
                      }}
                    />
                  ))}
                />
              </div>
            </section>

            <section>
              <SectionHeading eyebrow="Testimonials" title="What our community says" />
              <TestimonialsDisplay testimonials={testimonials} />
            </section>

            <section>
              <SectionHeading eyebrow="Coverage" title="Proudly serving Western Victoria" />
              <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
                Ballarat · Geelong · Warrnambool · Colac · Hamilton · Ararat
              </p>
              <div className="mt-8">
                <LandingGlobeLoader />
              </div>
            </section>
          </div>
        </TracingBeam>
      </div>

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
