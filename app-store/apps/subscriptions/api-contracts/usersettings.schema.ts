import { z } from "zod";

export const userSettingsSchema = z
  .object({
    id: z.string(),
    displayName: z.string().min(1),
    welcomeMessage: z.string().min(1),
    name: z.string().min(1),
    surname: z.string().min(1),
    phone: z.string().min(10),
  })
  .nullable();

export const userSettingsRequestSchema = z.object({
  displayName: z.string().min(1),
  welcomeMessage: z.string().min(1),
  name: z.string().min(1),
  surname: z.string().min(1),
  phone: z.string().min(10),
});

export type UserSettingsResponse = z.TypeOf<typeof userSettingsSchema>;
export type UserSettingsRequest = z.TypeOf<typeof userSettingsRequestSchema>;
