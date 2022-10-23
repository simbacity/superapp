import { z } from "zod";

export const messageRequestSchema = z.object({
  content: z.string().min(1),
  threadId: z.string().optional(),
  messageId: z.string().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  threadId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
});

export const messageListSchema = z.array(messageSchema);

export type Message = z.TypeOf<typeof messageSchema>;
export type MessageList = z.TypeOf<typeof messageListSchema>;
export type MessageRequest = z.TypeOf<typeof messageRequestSchema>;
