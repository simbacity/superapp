import { z } from "zod";

export const messageThreadSchema = z.object({
  id: z.string(),
  create_at: z.date(),
});

export type MessageThreadResponse = z.TypeOf<typeof messageThreadSchema>;
