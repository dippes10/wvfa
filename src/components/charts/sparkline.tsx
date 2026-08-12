"use client";

import { Line, LineChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

export function Sparkline({
  data,
  color = "var(--chart-1)",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const points = data.map((value, i) => ({ i, value }));
  const config = { value: { label: "Value", color } } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className={className ?? "h-10 w-24"}>
      <LineChart data={points} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
