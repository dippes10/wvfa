"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { Users, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD_SPACING = 48;
const SHIFT_DISTANCE = 88;

const ROLES = [
  {
    icon: Zap,
    title: "Players",
    blurb:
      "Log a session in seconds, watch your streak grow, and see exactly how training and sleep add up.",
  },
  {
    icon: Users,
    title: "Parents",
    blurb:
      "A calm, read-only view of your child's load and sleep — know when they need an easy day, without hovering.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    blurb:
      "One dashboard for the whole academy: approve accounts, spot at-risk players early, tune the rules.",
  },
] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, staggerDirection: -1 } },
};

const cardVariants: Variants = {
  hidden: (offset: number) => ({ opacity: 0, x: offset }),
  visible: { opacity: 1, x: 0, transition: { type: "spring", visualDuration: 0.5, bounce: 0.2 } },
};

export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isHovered = activeIndex !== null;

  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <h2
        className={cn(
          "text-center text-2xl font-bold tracking-tight transition-colors duration-500 sm:text-3xl",
          isHovered ? "text-primary" : "text-foreground",
        )}
      >
        Built for the whole team
      </h2>

      <motion.div
        className="relative h-[26rem] w-full max-w-md sm:max-w-lg"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {ROLES.map((role, index) => {
          const Icon = role.icon;
          const shouldShift = activeIndex !== null && index > activeIndex;
          const isActive = activeIndex === index;
          const entranceOffset = -index * CARD_SPACING;

          return (
            <motion.div
              key={role.title}
              className="absolute bottom-0 h-full w-56 cursor-pointer sm:w-64"
              style={{ left: index * CARD_SPACING }}
              variants={cardVariants}
              custom={entranceOffset}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex((current) => (current === index ? null : index))}
            >
              <motion.div
                className="relative h-full w-full"
                animate={{ x: shouldShift ? SHIFT_DISTANCE : 0 }}
                transition={{ type: "spring", visualDuration: 0.5, bounce: 0.2 }}
              >
                <div
                  className={cn(
                    "flex h-full w-full flex-col justify-between rounded-2xl border-2 bg-card p-5 shadow-lg transition-[border-color,box-shadow] duration-300",
                    isActive ? "border-primary shadow-primary/20" : "border-border",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full transition-colors duration-300",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.blurb}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
