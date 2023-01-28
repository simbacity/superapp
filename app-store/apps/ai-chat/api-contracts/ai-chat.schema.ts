import { z } from "zod";

export const aiChatSchema = z.object({
  id: z.string(),
  message: z.string().optional(),
});

export const aiChatListSchema = z.array(aiChatSchema);

export const aiChatRequestSchema = z.object({
  message: z.string().min(1),
});

export type AIChatResponse = z.TypeOf<typeof aiChatSchema>;
export type AIChatListResponse = z.TypeOf<typeof aiChatListSchema>;
export type AIChatRequest = z.TypeOf<typeof aiChatRequestSchema>;
