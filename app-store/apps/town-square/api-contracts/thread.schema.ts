import { z } from "zod";

export const messageThreadSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  user: z.object({}),
  created_at: z.date(),
});

export type MessageThreadResponse = z.TypeOf<typeof messageThreadSchema>;
