"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

// Avoids a light/dark flash on hydration: the server and the first client
// render must agree ("not mounted yet"), then this flips once React attaches.
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <SwitchPrimitive.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-muted p-1 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Sun className="pointer-events-none absolute left-1.5 size-3.5 text-muted-foreground/70" />
      <Moon className="pointer-events-none absolute right-1.5 size-3.5 text-muted-foreground/70" />
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn(
          "relative z-10 flex size-6 items-center justify-center rounded-full bg-metallic-gold shadow-md",
          isDark ? "ml-auto" : "ml-0",
        )}
      >
        {mounted ? (
          isDark ? (
            <Moon className="size-3.5 text-primary-foreground" />
          ) : (
            <Sun className="size-3.5 text-primary-foreground" />
          )
        ) : null}
      </motion.span>
    </SwitchPrimitive.Root>
  );
}
