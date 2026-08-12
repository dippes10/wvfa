"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import {
  computeMinutesTrend,
  computeLoadTrend,
  computeMinutesHistory,
  computeLoadHistory,
  classifyAcwr,
  ACWR_ZONE_ADVICE,
} from "@/lib/analysis/weekly-trends";
import { WeeklyTrendCard } from "./weekly-trend-card";
import { AcwrGauge } from "./acwr-gauge";
import { WeeklyHistoryChart } from "./weekly-history-chart";
import { cn } from "@/lib/utils";
import type { LoadEntry } from "@/lib/services/loadService";

const MODES = [
  { value: "summary", label: "Summary" },
  { value: "history", label: "6-week history" },
] as const;

type Mode = (typeof MODES)[number]["value"];

export function WeeklyTrendsPanel({ entries }: { entries: LoadEntry[] }) {
  const [mode, setMode] = useState<Mode>("summary");

  const minutesTrend = computeMinutesTrend(entries);
  const loadTrend = computeLoadTrend(entries);
  const zone = classifyAcwr(loadTrend.acwrRatio);

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full border border-border bg-muted p-0.5 text-sm">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-colors",
              mode === m.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "summary" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <WeeklyTrendCard title="Training minutes" trend={minutesTrend} unit="min" />
            <WeeklyTrendCard title="Session load" trend={loadTrend} unit="load" />
          </div>
          <AcwrGauge ratio={loadTrend.acwrRatio} label="Load ratio (this week vs 4-week avg)" />
          {zone && (
            <div className="flex items-start gap-2 rounded-2xl border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>{ACWR_ZONE_ADVICE[zone]}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Minutes / week</p>
            <WeeklyHistoryChart data={computeMinutesHistory(entries, 6)} unit="min" color="var(--chart-2)" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Load / week</p>
            <WeeklyHistoryChart data={computeLoadHistory(entries, 6)} unit="load" color="var(--chart-1)" />
          </div>
        </div>
      )}
    </div>
  );
}
