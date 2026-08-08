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
        No sessions logged yet — your chart will fill in as you go.
      </p>
    );
  }

  const total = data.reduce((sum, d) => sum + d.totalLoad, 0);
  const avgPerDay = Math.round(total / data.length);

  return (
    <div className="space-y-3">
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Total load</p>
          <p className="font-semibold text-primary">{total}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg / active day</p>
          <p className="font-semibold">{avgPerDay}</p>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 8, right: 8 }}>
          <defs>
            <linearGradient id="loadBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.55} />
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
          <YAxis tickLine={false} axisLine={false} width={28} fontSize={11} />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />}
          />
          <Bar dataKey="totalLoad" fill="url(#loadBarGradient)" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
