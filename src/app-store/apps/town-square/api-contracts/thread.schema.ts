import { messageSchema } from "./message.schema";
import { z } from "zod";

export const threadDefaultSchema = z.object({
  id: z.string(),
});

export const threadSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  mainMessage: messageSchema.optional(),
  messages: z.array(messageSchema),
  createdAt: z.date().or(z.string()),
});

export const threadListSchema = z.array(threadSchema);

export const threadRequestSchema = z.object({
  messageId: z.string(),
});

export type ThreadDefaultResponse = z.TypeOf<typeof threadDefaultSchema>;
export type ThreadResponse = z.TypeOf<typeof threadSchema>;
export type ThreadListResponse = z.TypeOf<typeof threadListSchema>;
export type ThreadRequest = z.TypeOf<typeof threadRequestSchema>;
