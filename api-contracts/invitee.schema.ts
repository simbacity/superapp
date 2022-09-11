import { z } from "zod";

export const inviteeSchema = z.object({
  id: z.string(),
  token: z.string(),
  email: z.string(),
});

export const inviteeRequestSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
});

export type InviteeResponse = z.TypeOf<typeof inviteeSchema>;
export type InviteeRequest = z.TypeOf<typeof inviteeRequestSchema>;
