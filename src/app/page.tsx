import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-primary/15 via-background to-accent/15 p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary text-4xl shadow-lg">
        ⚽
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Western Victoria Football Academy
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          Track your training load and sleep, stay injury-free, and see your progress — built for
          WVFA players, parents, and admins.
        </p>
      </div>
      <Link
        href="/login"
        className={buttonVariants({ size: "lg", className: "rounded-full px-8 text-base" })}
      >
        Get started
      </Link>
    </main>
  );
}
