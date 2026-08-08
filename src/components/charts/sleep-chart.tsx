"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { groupSleepByDate, average } from "@/lib/analysis/aggregate";
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
        No nights logged yet — your chart will fill in as you go.
      </p>
    );
  }

  const avgDuration = average(data.map((d) => d.avgDuration));
  const avgQuality = average(data.map((d) => d.avgQuality));

  return (
    <div className="space-y-3">
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Avg hours</p>
          <p className="font-semibold" style={{ color: "var(--chart-2)" }}>
            {avgDuration}h
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg quality</p>
          <p className="font-semibold" style={{ color: "var(--chart-3)" }}>
            {avgQuality}/10
          </p>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <AreaChart data={data} margin={{ left: 8, right: 8 }}>
          <defs>
            <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="avgDuration"
            stroke="var(--color-avgDuration)"
            strokeWidth={2}
            fill="url(#durationGradient)"
          />
          <Area
            type="monotone"
            dataKey="avgQuality"
            stroke="var(--color-avgQuality)"
            strokeWidth={2}
            fill="url(#qualityGradient)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
