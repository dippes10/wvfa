"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { groupSleepByDate } from "@/lib/analysis/aggregate";
import type { SleepEntry } from "@/lib/services/sleepService";

const chartConfig = {
  avgDuration: { label: "Hours slept", color: "var(--chart-2)" },
  avgQuality: { label: "Sleep quality", color: "var(--chart-3)" },
} satisfies ChartConfig;

function formatDay(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
  });
}

export function SleepChart({ entries }: { entries: SleepEntry[] }) {
  const data = groupSleepByDate(entries);

  if (data.length === 0) {
    return (
      <p className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No nights logged yet — your chart will fill in as you go!
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis domain={[0, 12]} tickLine={false} axisLine={false} width={28} fontSize={11} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="avgDuration"
          stroke="var(--color-avgDuration)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="avgQuality"
          stroke="var(--color-avgQuality)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
