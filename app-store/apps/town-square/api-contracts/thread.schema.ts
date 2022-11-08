import { messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { z } from "zod";

export const threadRequestSchema = z.object({
  messageId: z.string(),
});

export const threadSchema = z
  .object({
    id: z.string(),
    messageId: z.string(),
    mainMessage: z.optional(messageSchema),
    messages: z.array(messageSchema).optional(),
    createdAt: z.date().or(z.string()),
  })
  .nullable();

export const threadListSchema = z.array(threadSchema);

export type Thread = z.TypeOf<typeof threadRequestSchema>;
export type ThreadResponse = z.TypeOf<typeof threadSchema>;
export type ThreadList = z.TypeOf<typeof threadListSchema>;
