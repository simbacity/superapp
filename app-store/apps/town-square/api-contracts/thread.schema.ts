import { z } from "zod";

export const messageThreadSchema = z
  .object({
    id: z.string(),
    messageId: z.string(),
    messages: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        threadId: z.string().nullable(),
        createdAt: z.date(),
        user: z.object({
          id: z.string(),
          name: z.string().nullable(),
          image: z.string().nullable(),
        }),
      })
    ),
    mainMessage: z
      .object({
        id: z.string(),
        content: z.string(),
        threadId: z.string().nullable(),
        createdAt: z.date(),
      })
      .nullable(),
    createdAt: z.date(),
  })
  .nullable();

export const messageThreadResponseSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  createdAt: z.date(),
});

export type MessageThread = z.TypeOf<typeof messageThreadSchema>;
export type MessageThreadResponse = z.TypeOf<typeof messageThreadResponseSchema>;
