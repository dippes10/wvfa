import { z } from "zod";

export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(80),
  dateOfBirth: z.string().optional().nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const assignableRoles = ["player", "parent", "head_admin"] as const;

export const approveUserSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(assignableRoles),
});

export type ApproveUserInput = z.infer<typeof approveUserSchema>;

export const linkGuardianSchema = z.object({
  guardianId: z.string().uuid(),
  playerId: z.string().uuid(),
});

export type LinkGuardianInput = z.infer<typeof linkGuardianSchema>;
