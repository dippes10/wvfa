import type { LoadEntry } from "@/lib/services/loadService";
import type { AcademySettings } from "@/lib/services/settingsService";

export function isHardSession(
  entry: Pick<LoadEntry, "rpe">,
  settings: Pick<AcademySettings, "hard_rpe_threshold">,
): boolean {
  return entry.rpe >= settings.hard_rpe_threshold;
}

export function hardSessionsInWindow(
  entries: LoadEntry[],
  settings: AcademySettings,
  windowDays = 7,
  referenceDate = new Date(),
): LoadEntry[] {
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - windowDays + 1);
  const startIso = start.toISOString().slice(0, 10);
  const refIso = referenceDate.toISOString().slice(0, 10);

  return entries.filter(
    (e) => isHardSession(e, settings) && e.activity_date >= startIso && e.activity_date <= refIso,
  );
}

export function hasSequentialHardDays(entries: LoadEntry[], settings: AcademySettings): boolean {
  const hardDates = Array.from(
    new Set(entries.filter((e) => isHardSession(e, settings)).map((e) => e.activity_date)),
  ).sort();

  for (let i = 1; i < hardDates.length; i++) {
    const diffDays =
      (new Date(hardDates[i]).getTime() - new Date(hardDates[i - 1]).getTime()) / 86_400_000;
    if (diffDays === 1) return true;
  }
  return false;
}

export interface LoadRisk {
  hardSessionCount7d: number;
  overHardSessionLimit: boolean;
  sequentialHardDays: boolean;
  isFlagged: boolean;
}

export function computeLoadRisk(entries: LoadEntry[], settings: AcademySettings): LoadRisk {
  const hard7d = hardSessionsInWindow(entries, settings, 7);
  const overLimit = hard7d.length > settings.max_hard_sessions_week;
  const sequential = hasSequentialHardDays(entries, settings);
  return {
    hardSessionCount7d: hard7d.length,
    overHardSessionLimit: overLimit,
    sequentialHardDays: sequential,
    isFlagged: overLimit || sequential,
  };
}
