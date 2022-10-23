import { messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { z } from "zod";

export const threadSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  createdAt: z.date(),
});

export const threadDeleteSchema = z.tuple([messageSchema, threadSchema]);

export type Thread = z.TypeOf<typeof threadSchema>;
