"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { groupLoadByDate } from "@/lib/analysis/aggregate";
import type { LoadEntry } from "@/lib/services/loadService";

const chartConfig = {
  totalLoad: { label: "Session load", color: "var(--chart-1)" },
} satisfies ChartConfig;

function formatDay(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
  });
}

export function LoadChart({ entries }: { entries: LoadEntry[] }) {
  const data = groupLoadByDate(entries);

  if (data.length === 0) {
    return (
      <p className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No sessions logged yet — your chart will fill in as you go!
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis tickLine={false} axisLine={false} width={28} fontSize={11} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />}
        />
        <Bar dataKey="totalLoad" fill="var(--color-totalLoad)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
