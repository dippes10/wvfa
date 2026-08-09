import { computeMinutesTrend, computeLoadTrend } from "@/lib/analysis/weekly-trends";
import { WeeklyTrendCard } from "./weekly-trend-card";
import { AcwrGauge } from "./acwr-gauge";
import type { LoadEntry } from "@/lib/services/loadService";

export function WeeklyTrendsPanel({ entries }: { entries: LoadEntry[] }) {
  const minutesTrend = computeMinutesTrend(entries);
  const loadTrend = computeLoadTrend(entries);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <WeeklyTrendCard title="Training minutes" trend={minutesTrend} unit="min" />
        <WeeklyTrendCard title="Session load" trend={loadTrend} unit="load" />
      </div>
      <AcwrGauge ratio={loadTrend.acwrRatio} label="Load ratio (this week vs 4-week avg)" />
    </div>
  );
}
