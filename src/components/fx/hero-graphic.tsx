"use client";

import { motion } from "motion/react";

const TRAIL = [
  { top: "62%", left: "8%", size: "3.5rem", opacity: 0.9, delay: 0 },
  { top: "48%", left: "22%", size: "2.75rem", opacity: 0.7, delay: 0.15 },
  { top: "36%", left: "36%", size: "2rem", opacity: 0.5, delay: 0.3 },
  { top: "27%", left: "49%", size: "1.35rem", opacity: 0.32, delay: 0.45 },
] as const;

export function HeroGraphic() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Gold glow */}
      <motion.div
        className="absolute top-[-10%] right-[-10%] size-[32rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.15 85 / 0.35), transparent 70%)",
        }}
        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Miami pink glow */}
      <motion.div
        className="absolute bottom-[-15%] left-[-8%] size-[26rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.19 350 / 0.28), transparent 70%)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Emblem ring */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="200,20 365,110 365,290 200,380 35,290 35,110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
      </motion.svg>

      {/* Kicked-ball trail */}
      {TRAIL.map((ball, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{
            top: ball.top,
            left: ball.left,
            fontSize: ball.size,
            opacity: ball.opacity,
            filter: i > 0 ? `blur(${i * 0.5}px)` : undefined,
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: ball.delay }}
        >
          ⚽
        </motion.span>
      ))}
    </div>
  );
}
