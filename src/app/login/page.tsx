"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { TimerReset } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { LoginShowcase } from "@/components/auth/login-showcase";
import { ThemeToggle } from "@/components/fx/theme-toggle";
import { BrandMark } from "@/components/fx/brand-mark";

function TimeoutNotice() {
  const params = useSearchParams();
  if (params.get("reason") !== "timeout") return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
      <TimerReset className="size-3.5 shrink-0" />
      You were signed out after a period of inactivity. Please sign in again.
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <LoginShowcase />

      <div className="relative flex items-center justify-center bg-background p-6">
        <ThemeToggle className="absolute top-4 right-4" />
        <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 lg:hidden">
          <BrandMark className="size-8" iconClassName="size-4" />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="space-y-1.5 text-center">
            <BrandMark className="mx-auto mb-3 size-14 lg:hidden" iconClassName="size-7" />
            <h1 className="text-2xl font-bold">Welcome to WVFA</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to log your training load and sleep, and track your progress.
            </p>
          </div>

          <Suspense fallback={null}>
            <TimeoutNotice />
          </Suspense>

          <GoogleSignInButton />

          <p className="text-center text-xs text-muted-foreground">
            First time here? An academy admin will approve your account after you sign in.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="underline underline-offset-2">
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
