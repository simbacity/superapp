import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  thread: z
    .object({
      id: z.string(),
      messageId: z.string(),
    })
    .nullable(),
  replyCount: z.number(),
  createdAt: z.date(),
});

export const messageListSchema = z.array(messageSchema);

export const messageRequestSchema = z.object({
  content: z.string().min(1),
  threadId: z.string().optional(),
  messageId: z.string().optional(),
});

export const messageQuerySchema = z.object({
  take: z.number(),
  cursor: z
    .object({
      id: z.string(),
    })
    .optional(),
  skip: z.number().optional(),
  include: z.object({
    thread: z.object({
      select: z.object({
        id: z.boolean(),
        messageId: z.boolean(),
      }),
    }),
    user: z.object({
      select: z.object({
        id: z.boolean(),
        name: z.boolean(),
        image: z.boolean(),
      }),
    }),
  }),
});

export type MessageResponse = z.TypeOf<typeof messageSchema>;
export type MessageListResponse = z.TypeOf<typeof messageListSchema>;
export type MessageRequest = z.TypeOf<typeof messageRequestSchema>;
export type MessageQueryParams = z.TypeOf<typeof messageQuerySchema>;
