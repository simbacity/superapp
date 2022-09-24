import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  user: z.object({
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  thread: z
    .object({
      messageId: z.string(),
    })
    .nullable(),
  createdAt: z.date(),
});

export const messageListSchema = z.array(messageSchema);

export const messageRequestSchema = z.object({
  content: z.string().min(1),
  threadId: z.string().optional(),
  messageId: z.string(),
});

export type MessageResponse = z.TypeOf<typeof messageSchema>;
export type MessageListResponse = z.TypeOf<typeof messageListSchema>;
export type MessageRequest = z.TypeOf<typeof messageRequestSchema>;
