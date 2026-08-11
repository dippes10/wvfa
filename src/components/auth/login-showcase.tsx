"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { BrandMark } from "@/components/fx/brand-mark";

export function LoginShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(springX, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["20%", "80%"]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative hidden h-full w-full items-center justify-center overflow-hidden bg-foreground lg:flex"
      style={{ perspective: 1000 }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[36rem] rounded-full opacity-25 blur-3xl"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, oklch(0.78 0.16 85) 0%, transparent 70%)",
        }}
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full opacity-[0.08]"
        style={{ color: "var(--background)" }}
      >
        <defs>
          <pattern id="pitch-lines" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M0 32H64M32 0V64" stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pitch-lines)" />
      </svg>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 flex flex-col items-center gap-6 px-12 text-center"
      >
        <motion.div style={{ transform: "translateZ(40px)" }}>
          <BrandMark className="size-24 shadow-2xl" iconClassName="size-12" />
        </motion.div>
        <div style={{ transform: "translateZ(20px)" }} className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.3em] text-background/60 uppercase">
            Western Victoria Football Academy
          </p>
          <h2 className="max-w-sm text-3xl font-bold text-balance text-background">
            Train <span className="text-metallic-gold">smarter</span>. Recover{" "}
            <span className="text-metallic-gold">better</span>.
          </h2>
          <p className="max-w-xs text-sm text-background/60">
            One place to log every session, every night&apos;s sleep, and see it add up.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
