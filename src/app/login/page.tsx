"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { ThemeToggle } from "@/components/fx/theme-toggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/10 via-background to-accent/10 p-6">
      <ThemeToggle className="absolute top-4 right-4" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <Card className="rounded-3xl border-2 shadow-lg">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-primary text-3xl">
              ⚽
            </div>
            <CardTitle className="text-2xl">Welcome to WVFA</CardTitle>
            <CardDescription>
              Sign in to log your training load and sleep, and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GoogleSignInButton />
            <p className="text-center text-xs text-muted-foreground">
              First time here? An academy admin will approve your account after you sign in.
            </p>
            <p className="text-center text-xs text-muted-foreground">
              <Link href="/" className="underline underline-offset-2">
                Back to home
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
