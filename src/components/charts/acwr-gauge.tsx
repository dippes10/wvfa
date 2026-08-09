import { classifyAcwr, ACWR_ZONE_LABEL, type AcwrZone } from "@/lib/analysis/weekly-trends";
import { cn } from "@/lib/utils";

const ZONE_BADGE: Record<AcwrZone, string> = {
  undertrained: "bg-muted-foreground/15 text-muted-foreground",
  optimal: "bg-primary/15 text-primary",
  caution: "bg-[var(--chart-3)]/15 text-[var(--chart-3)]",
  "high-risk": "bg-destructive/15 text-destructive",
};

const ZONE_DOT: Record<AcwrZone, string> = {
  undertrained: "bg-muted-foreground",
  optimal: "bg-primary",
  caution: "bg-[var(--chart-3)]",
  "high-risk": "bg-destructive",
};

// Zone boundaries as % of the gauge's 0-2.0 display range (Gabbett et al. ACWR zones).
const ZONE_TRACK: { className: string; left: number; width: number }[] = [
  { className: "bg-muted-foreground/20", left: 0, width: 40 }, // 0 - 0.8
  { className: "bg-primary/25", left: 40, width: 25 }, // 0.8 - 1.3
  { className: "bg-[var(--chart-3)]/25", left: 65, width: 10 }, // 1.3 - 1.5
  { className: "bg-destructive/25", left: 75, width: 25 }, // 1.5 - 2.0+
];

export function AcwrGauge({ ratio, label }: { ratio: number | null; label?: string }) {
  const zone = classifyAcwr(ratio);
  const max = 2;
  const clamped = ratio === null ? 0 : Math.min(ratio, max);
  const positionPercent = (clamped / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label ?? "Load ratio (ACWR)"}</p>
        {zone ? (
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", ZONE_BADGE[zone])}>
            {ratio?.toFixed(2)} · {ACWR_ZONE_LABEL[zone]}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No baseline yet</span>
        )}
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {ZONE_TRACK.map((z) => (
          <div
            key={z.left}
            className={cn("absolute inset-y-0", z.className)}
            style={{ left: `${z.left}%`, width: `${z.width}%` }}
          />
        ))}
        {ratio !== null && (
          <div
            className={cn(
              "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow",
              zone ? ZONE_DOT[zone] : "bg-foreground",
            )}
            style={{ left: `${positionPercent}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0.8</span>
        <span>1.3</span>
        <span>1.5</span>
        <span>2.0+</span>
      </div>
    </div>
  );
}
