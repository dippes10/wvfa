"use client";

import { motion } from "motion/react";

export function HeroGraphic() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Gold glow */}
      <motion.div
        className="absolute top-[-15%] right-[-10%] size-[30rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.15 85 / 0.28), transparent 70%)",
        }}
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Miami pink glow — restrained, a whisper not a spotlight */}
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] size-[24rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.19 350 / 0.16), transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
}
