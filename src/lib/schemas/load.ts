import { z } from "zod";

export const loadEntrySchema = z.object({
  activityDate: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Add a short description").max(120),
  durationMinutes: z.coerce.number().int().min(1, "Must be at least 1 minute").max(600),
  rpe: z.coerce.number().int().min(0).max(10),
});

export type LoadEntryInput = z.infer<typeof loadEntrySchema>;

export const activityOptions = [
  "Team Training",
  "Match",
  "Gym",
  "Personal Practice",
  "Other",
] as const;
