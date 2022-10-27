import { z } from "zod";

export const messageRequestSchema = z.object({
  content: z.string().min(1),
  messageId: z.string().optional(),
  threadId: z.string().optional(),
  userId: z.string().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  threadId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date().or(z.string()),
  user: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      image: z.string().nullable(),
    })
    .optional(),
});

export const messageListSchema = z.array(messageSchema);

export type Message = z.TypeOf<typeof messageSchema>;
export type MessageList = z.TypeOf<typeof messageListSchema>;
export type MessageRequest = z.TypeOf<typeof messageRequestSchema>;

export const testSchema = z.object({
  // data: z.object({
  // pages: z.array(
  //   z.object({
  //     data: messageListSchema,
  //   })
  // ),
  data: messageListSchema,
  pageParams: z.array(z.string()),
  // }),
});
