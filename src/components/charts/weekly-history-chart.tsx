"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { WeeklyHistoryPoint } from "@/lib/analysis/weekly-trends";

export function WeeklyHistoryChart({
  data,
  unit,
  color = "var(--chart-1)",
}: {
  data: WeeklyHistoryPoint[];
  unit: string;
  color?: string;
}) {
  const chartConfig = {
    total: { label: unit, color },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-44 w-full">
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} width={28} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill={color} radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
