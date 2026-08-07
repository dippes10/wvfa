export function computeStreak(loggedDates: string[]): number {
  const uniqueDates = new Set(loggedDates);
  let streak = 0;
  const cursor = new Date();

  // Allow "today" to be missing without breaking the streak (they may not have logged yet today).
  const todayIso = cursor.toISOString().slice(0, 10);
  if (!uniqueDates.has(todayIso)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (uniqueDates.has(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
