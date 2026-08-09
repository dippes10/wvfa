import type { LoadEntry } from "@/lib/services/loadService";

export interface WeeklyTrend {
  thisWeekTotal: number;
  lastWeekTotal: number;
  /** (thisWeek - lastWeek) / lastWeek, as a whole-number percent. Null if lastWeek was 0 (undefined change). */
  weekOverWeekPercent: number | null;
  /** Average of the 4 weeks before this week (not including this week). */
  fourWeekAvg: number;
  /** thisWeekTotal / fourWeekAvg — acute:chronic workload ratio. Null if fourWeekAvg was 0. */
  acwrRatio: number | null;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `date`. */
function weekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday .. 6 = Saturday
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekRange(weeksAgo: number, referenceDate: Date): { start: string; end: string } {
  const start = weekStart(referenceDate);
  start.setDate(start.getDate() - weeksAgo * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start: isoDate(start), end: isoDate(end) };
}

function sumInRange<T>(
  entries: T[],
  getDate: (entry: T) => string,
  getValue: (entry: T) => number,
  range: { start: string; end: string },
): number {
  return entries
    .filter((e) => {
      const d = getDate(e);
      return d >= range.start && d <= range.end;
    })
    .reduce((sum, e) => sum + getValue(e), 0);
}

export function computeWeeklyTrend<T>(
  entries: T[],
  getDate: (entry: T) => string,
  getValue: (entry: T) => number,
  referenceDate = new Date(),
): WeeklyTrend {
  const thisWeekTotal = sumInRange(entries, getDate, getValue, weekRange(0, referenceDate));
  const lastWeekTotal = sumInRange(entries, getDate, getValue, weekRange(1, referenceDate));

  const weekOverWeekPercent =
    lastWeekTotal > 0
      ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
      : null;

  const previous4WeekTotals = [1, 2, 3, 4].map((w) =>
    sumInRange(entries, getDate, getValue, weekRange(w, referenceDate)),
  );
  const fourWeekAvg =
    Math.round((previous4WeekTotals.reduce((a, b) => a + b, 0) / 4) * 10) / 10;

  const acwrRatio = fourWeekAvg > 0 ? Math.round((thisWeekTotal / fourWeekAvg) * 100) / 100 : null;

  return { thisWeekTotal, lastWeekTotal, weekOverWeekPercent, fourWeekAvg, acwrRatio };
}

export function computeMinutesTrend(entries: LoadEntry[], referenceDate?: Date): WeeklyTrend {
  return computeWeeklyTrend(
    entries,
    (e) => e.activity_date,
    (e) => e.duration_minutes,
    referenceDate,
  );
}

export function computeLoadTrend(entries: LoadEntry[], referenceDate?: Date): WeeklyTrend {
  return computeWeeklyTrend(
    entries,
    (e) => e.activity_date,
    (e) => e.session_load,
    referenceDate,
  );
}

export type AcwrZone = "undertrained" | "optimal" | "caution" | "high-risk";

export const ACWR_ZONE_LABEL: Record<AcwrZone, string> = {
  undertrained: "Under-trained",
  optimal: "Optimal",
  caution: "Caution",
  "high-risk": "High risk",
};

/** Standard acute:chronic workload ratio danger zones (Gabbett et al.). */
export function classifyAcwr(ratio: number | null): AcwrZone | null {
  if (ratio === null) return null;
  if (ratio < 0.8) return "undertrained";
  if (ratio <= 1.3) return "optimal";
  if (ratio <= 1.5) return "caution";
  return "high-risk";
}
