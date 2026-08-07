export interface DailyLoadPoint {
  date: string;
  totalLoad: number;
}

export function groupLoadByDate(entries: { activity_date: string; session_load: number }[]): DailyLoadPoint[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    map.set(e.activity_date, (map.get(e.activity_date) ?? 0) + e.session_load);
  }
  return Array.from(map.entries())
    .map(([date, totalLoad]) => ({ date, totalLoad }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface DailySleepPoint {
  date: string;
  avgDuration: number;
  avgQuality: number;
}

export function groupSleepByDate(
  entries: { entry_date: string; duration_hours: number; quality: number }[],
): DailySleepPoint[] {
  const map = new Map<string, { durationSum: number; qualitySum: number; count: number }>();
  for (const e of entries) {
    const cur = map.get(e.entry_date) ?? { durationSum: 0, qualitySum: 0, count: 0 };
    cur.durationSum += e.duration_hours;
    cur.qualitySum += e.quality;
    cur.count += 1;
    map.set(e.entry_date, cur);
  }
  return Array.from(map.entries())
    .map(([date, { durationSum, qualitySum, count }]) => ({
      date,
      avgDuration: Math.round((durationSum / count) * 10) / 10,
      avgQuality: Math.round((qualitySum / count) * 10) / 10,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
