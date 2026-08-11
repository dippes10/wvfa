import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "@/components/charts/sparkline";
import { cn } from "@/lib/utils";

export function KpiWidget({
  icon: Icon,
  label,
  value,
  caption,
  trendPercent,
  sparklineData,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  caption?: string;
  /** Positive = trending up (gold), negative = trending down (destructive), omit to hide. */
  trendPercent?: number | null;
  sparklineData?: number[];
  className?: string;
}) {
  return (
    <Card className={cn("rounded-3xl", className)}>
      <CardContent className="space-y-3 py-1">
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="size-4.5" />
          </div>
          {typeof trendPercent === "number" && (
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                trendPercent >= 0
                  ? "bg-primary/15 text-primary"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {trendPercent >= 0 ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {Math.abs(trendPercent)}%
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <Sparkline data={sparklineData} className="h-9 w-16" />
          )}
        </div>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </CardContent>
    </Card>
  );
}
