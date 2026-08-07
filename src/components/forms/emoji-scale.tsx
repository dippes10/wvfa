"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ScalePoint {
  value: number;
  emoji: string;
  label: string;
}

export function EmojiScale({
  name,
  points,
  defaultValue,
}: {
  name: string;
  points: ScalePoint[];
  defaultValue: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const current = points.find((p) => p.value === value) ?? points[0];

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap justify-between gap-1.5">
        {points.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setValue(p.value)}
            aria-pressed={value === p.value}
            title={`${p.value} — ${p.label}`}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border-2 text-lg transition-transform sm:size-10",
              value === p.value
                ? "scale-110 border-primary bg-primary/20"
                : "border-transparent bg-muted hover:scale-105",
            )}
          >
            {p.emoji}
          </button>
        ))}
      </div>
      <p className="text-center text-sm font-medium">
        {value} — {current.label}
      </p>
    </div>
  );
}

export const RPE_POINTS: ScalePoint[] = [
  { value: 0, emoji: "😴", label: "Resting" },
  { value: 1, emoji: "🙂", label: "Very Easy" },
  { value: 2, emoji: "🙂", label: "Easy" },
  { value: 3, emoji: "😊", label: "Easy" },
  { value: 4, emoji: "😅", label: "Moderate" },
  { value: 5, emoji: "😅", label: "Moderate" },
  { value: 6, emoji: "😓", label: "Somewhat Hard" },
  { value: 7, emoji: "😤", label: "Hard" },
  { value: 8, emoji: "🥵", label: "Hard" },
  { value: 9, emoji: "🔥", label: "Very Hard" },
  { value: 10, emoji: "🚀", label: "Max Effort" },
];

export const SLEEP_QUALITY_POINTS: ScalePoint[] = [
  { value: 0, emoji: "😩", label: "Terrible" },
  { value: 1, emoji: "😞", label: "Rough" },
  { value: 2, emoji: "😕", label: "Poor" },
  { value: 3, emoji: "😐", label: "Meh" },
  { value: 4, emoji: "🙂", label: "Okay" },
  { value: 5, emoji: "🙂", label: "Okay" },
  { value: 6, emoji: "😌", label: "Good" },
  { value: 7, emoji: "😊", label: "Good" },
  { value: 8, emoji: "😃", label: "Great" },
  { value: 9, emoji: "🤩", label: "Amazing" },
  { value: 10, emoji: "⚡", label: "Fully Charged" },
];
