import { z } from "zod";

export const pushSubscriptionSchema = z.object({
  id: z.string(),
  subscriptionObject: z.string(),
  userId: z.string(),
  createdAt: z.date().or(z.string()),
});

export const pushSubscriptionRequestSchema = z.object({
  subscriptionObject: z.string().min(1),
});

export type PushSubscriptionResponse = z.TypeOf<typeof pushSubscriptionSchema>;
export type PushSubscriptionRequest = z.TypeOf<typeof pushSubscriptionRequestSchema>;
