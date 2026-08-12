import Link from "next/link";
import { Activity, BarChart3, MoonStar, Users2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { listApprovedTestimonials } from "@/lib/services/testimonialService";
import { buttonVariants } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { WobbleCard } from "@/components/ui/wobble-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingNavbar } from "@/components/nav/landing-navbar";
import { LandingFooter } from "@/components/nav/landing-footer";
import { SectionHeading } from "@/components/fx/section-heading";
import { HeroBallLoader } from "@/components/scenes/hero-ball-loader";
import { TestimonialsDisplay } from "@/components/testimonials-display";
import { GALLERY_ITEMS } from "@/lib/data/gallery";
import { HOW_IT_WORKS, WHY_WVFA, FAQ_ITEMS, COVERAGE_TOWNS } from "@/lib/data/landing-content";

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
  {
    icon: Users2,
    title: "Family Visibility",
    body: "Linked parent accounts see the same trends the coaching staff sees — no guesswork.",
  },
] as const;

export default async function HomePage() {
  const supabase = await createClient();
  // Public marketing page — a testimonials fetch problem shouldn't take the whole page down.
  const testimonials = await listApprovedTestimonials(supabase).catch(() => []);

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <LandingNavbar />

      <BackgroundBeamsWithCollision className="h-auto min-h-[36rem] sm:min-h-[40rem]">
        <div className="relative z-20 flex flex-col items-center gap-5 px-6 text-center">
          <HeroBallLoader className="mb-1" />
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Western Victoria Football Academy
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            Train <span className="text-metallic-gold">smarter</span>. Recover{" "}
            <span className="text-metallic-gold">better</span>.
          </h1>
          <TextGenerateEffect
            words="Session load, sleep, and recovery tracked properly, for players, parents, and coaches across the academy."
            className="max-w-md"
            duration={0.4}
          />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shine-sweep bg-metallic-gold mt-2 rounded-full border-0 px-8 text-base font-semibold shadow-lg",
            )}
          >
            Join the Academy
          </Link>
        </div>
      </BackgroundBeamsWithCollision>

      <div className="px-4 md:px-16">
        <TracingBeam className="max-w-5xl">
          <div className="space-y-24 py-20">
            <section id="platform">
              <SectionHeading eyebrow="Platform" title="Everything the academy needs" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

            <section id="how-it-works">
              <SectionHeading eyebrow="How it works" title="From sign-up to first insight" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {HOW_IT_WORKS.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.step} className="relative rounded-2xl border border-border bg-card p-6">
                      <span className="text-metallic-gold text-3xl font-bold">{step.step}</span>
                      <div className="mt-3 flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="why-wvfa">
              <SectionHeading eyebrow="Why WVFA" title="Built around player wellbeing" />
              <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {WHY_WVFA.map((item, i) => (
                  <WobbleCard
                    key={item.title}
                    containerClassName={cn(
                      "h-full min-h-[16rem]",
                      i === 0 ? "bg-foreground" : i === 1 ? "bg-metallic-gold" : "bg-card border border-border",
                    )}
                  >
                    <h3
                      className={cn(
                        "text-xl font-semibold",
                        i === 0 ? "text-background" : i === 1 ? "text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 max-w-sm text-sm",
                        i === 0
                          ? "text-background/70"
                          : i === 1
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                      )}
                    >
                      {item.body}
                    </p>
                  </WobbleCard>
                ))}
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
              <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
                {COVERAGE_TOWNS.map((town) => (
                  <span
                    key={town}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm"
                  >
                    <MapPin className="size-3.5 text-primary" />
                    {town}
                  </span>
                ))}
              </div>
            </section>

            <section id="faq">
              <SectionHeading eyebrow="FAQ" title="Good to know" />
              <div className="mx-auto mt-8 max-w-2xl">
                <Accordion>
                  {FAQ_ITEMS.map((item) => (
                    <AccordionItem key={item.question} value={item.question}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          </div>
        </TracingBeam>
      </div>

      <LandingFooter />
    </main>
  );
}
