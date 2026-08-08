interface RiskGaugeProps {
  value: number;
  max: number;
  title: string;
  caption: string;
}

export function RiskGauge({ value, max, title, caption }: RiskGaugeProps) {
  const safeMax = Math.max(max, 1);
  const pct = Math.min(value / safeMax, 1);
  const overLimit = value > max;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const strokeColor = overLimit
    ? "var(--destructive)"
    : pct >= 0.67
      ? "var(--chart-3)"
      : "var(--primary)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-32">
        <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs text-muted-foreground">of {max}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}
