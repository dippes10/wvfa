import { z } from "zod";

export const sleepEntrySchema = z.object({
  entryDate: z.string().min(1, "Date is required"),
  durationHours: z.coerce.number().min(0, "Cannot be negative").max(24),
  quality: z.coerce.number().int().min(0).max(10),
});

export type SleepEntryInput = z.infer<typeof sleepEntrySchema>;
