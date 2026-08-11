import Link from "next/link";
import { Activity, BarChart3, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { listApprovedTestimonials } from "@/lib/services/testimonialService";
import { buttonVariants } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { LandingNavbar } from "@/components/nav/landing-navbar";
import { LandingFooter } from "@/components/nav/landing-footer";
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
      <LandingNavbar />

      <BackgroundBeamsWithCollision className="h-auto min-h-[34rem] sm:min-h-[38rem]">
        <div className="relative z-20 flex flex-col items-center gap-5 px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Western Victoria Football Academy
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            Train <span className="text-metallic-gold">smarter</span>. Recover{" "}
            <span className="text-metallic-gold">better</span>.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Session load, sleep, and recovery — tracked properly, for players, parents, and
            coaches across the academy.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shine-sweep bg-metallic-gold mt-2 rounded-full border-0 px-8 text-base font-semibold shadow-lg",
            )}
          >
            Get started
          </Link>
        </div>
      </BackgroundBeamsWithCollision>

      <div className="px-4 md:px-16">
        <TracingBeam className="max-w-5xl">
          <div className="space-y-24 py-20">
            <section id="platform">
              <SectionHeading eyebrow="Platform" title="Everything the academy needs" />
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <CometCard key={feature.title} className="w-full">
                      <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-left shadow-md">
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-2xl"
                        />
                        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                          <Icon className="size-6" />
                        </div>
                        <h3 className="relative text-lg font-semibold">{feature.title}</h3>
                        <p className="relative text-sm text-muted-foreground">{feature.body}</p>
                      </div>
                    </CometCard>
                  );
                })}
              </div>
            </section>

            <section id="gallery">
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
                        content: <p className="text-muted-foreground">{item.description}</p>,
                      }}
                    />
                  ))}
                />
              </div>
            </section>

            <section id="testimonials">
              <SectionHeading eyebrow="Testimonials" title="What our community says" />
              <TestimonialsDisplay testimonials={testimonials} />
            </section>

            <section id="coverage">
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

      <LandingFooter />
    </main>
  );
}
