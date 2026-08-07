import { z } from "zod";

export const academySettingsSchema = z
  .object({
    hardRpeThreshold: z.coerce.number().int().min(1).max(10),
    maxHardSessionsWeek: z.coerce.number().int().min(1).max(7),
    guidedModeAgeCutoff: z.coerce.number().int().min(0).max(25),
    sleepTargetMinHours: z.coerce.number().min(0).max(24),
    sleepTargetMaxHours: z.coerce.number().min(0).max(24),
  })
  .refine((d) => d.sleepTargetMinHours <= d.sleepTargetMaxHours, {
    message: "Minimum sleep target must be less than or equal to the maximum",
    path: ["sleepTargetMaxHours"],
  });

export type AcademySettingsInput = z.infer<typeof academySettingsSchema>;
