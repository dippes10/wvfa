import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { WeeklyTrend } from "@/lib/analysis/weekly-trends";
import { cn } from "@/lib/utils";

export function WeeklyTrendCard({
  title,
  trend,
  unit,
}: {
  title: string;
  trend: WeeklyTrend;
  unit: string;
}) {
  const pct = trend.weekOverWeekPercent;
  const Icon = pct === null || pct === 0 ? Minus : pct > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{trend.thisWeekTotal}</span>
        <span className="text-xs text-muted-foreground">{unit} this week</span>
      </div>
      <div className="mt-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-sm font-medium",
          )}
        >
          <Icon className="size-3.5" />
          {pct === null ? "No data last week" : `${pct > 0 ? "+" : ""}${pct}% vs last week`}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        4-week avg: {trend.fourWeekAvg} {unit}
      </p>
    </div>
  );
}
