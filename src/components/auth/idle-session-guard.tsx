"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TimerReset } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  IDLE_TIMEOUT_MS,
  IDLE_WARNING_AFTER_MS,
  LAST_ACTIVITY_STORAGE_KEY,
} from "@/lib/session/idle-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;
const THROTTLE_MS = 2000;

export function IdleSessionGuard() {
  const router = useRouter();
  const lastActivityRef = useRef<number>(0);
  const lastRecordedRef = useRef<number>(0);
  const signingOutRef = useRef(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState(IDLE_TIMEOUT_MS - IDLE_WARNING_AFTER_MS);

  const signOut = useCallback(async () => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    const supabase = createClient();
    await supabase.auth.signOut();
    try {
      localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY);
    } catch {
      // ignore
    }
    router.push("/login?reason=timeout");
    router.refresh();
  }, [router]);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    if (now - lastRecordedRef.current > THROTTLE_MS) {
      lastRecordedRef.current = now;
      try {
        localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(now));
      } catch {
        // Storage unavailable (private browsing etc.) — in-memory timer still works.
      }
    }
    setWarningOpen(false);
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (stored) {
      const elapsed = Date.now() - Number(stored);
      if (elapsed >= IDLE_TIMEOUT_MS) {
        void signOut();
        return;
      }
      lastActivityRef.current = Date.now() - elapsed;
    } else {
      lastActivityRef.current = Date.now();
    }

    const check = () => {
      if (signingOutRef.current) return;
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= IDLE_TIMEOUT_MS) {
        void signOut();
      } else if (elapsed >= IDLE_WARNING_AFTER_MS) {
        setWarningOpen(true);
        setRemainingMs(IDLE_TIMEOUT_MS - elapsed);
      }
    };

    const interval = setInterval(check, 1000);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }));

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, recordActivity));
    };
  }, [recordActivity, signOut]);

  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  return (
    <Dialog open={warningOpen} onOpenChange={(open) => !open && recordActivity()}>
      <DialogContent showCloseButton={false} className="sm:max-w-xs">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <TimerReset className="size-5" />
          </div>
          <DialogTitle>Still there?</DialogTitle>
          <DialogDescription>
            You&apos;ve been inactive for a while. For your account&apos;s security, you&apos;ll be
            signed out in {remainingSeconds}s.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out now
          </Button>
          <Button onClick={recordActivity}>Stay signed in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
