// After this much inactivity, the warning dialog appears with a countdown.
export const IDLE_WARNING_AFTER_MS = 14 * 60 * 1000;
// Total time before a forced sign-out once idle (warning window included).
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
export const IDLE_COUNTDOWN_MS = IDLE_TIMEOUT_MS - IDLE_WARNING_AFTER_MS;
export const LAST_ACTIVITY_STORAGE_KEY = "wvfa:last-activity";
