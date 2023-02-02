import { z } from "zod";

export const aiChatSchema = z.object({
  id: z.string(),
  message: z.string().optional(),
});

export const aiChatListSchema = z.array(aiChatSchema);

export const aiChatRequestSchema = z.object({
  message: z.string().min(1),
  model: z.string().optional(),
});

export const aiModelSchema = z.object({
  id: z.string(),
  object: z.string(),
});

export const aiModelsListSchema = z.array(aiModelSchema);

export type AIChatResponse = z.TypeOf<typeof aiChatSchema>;
export type AIChatListResponse = z.TypeOf<typeof aiChatListSchema>;
export type AIChatRequest = z.TypeOf<typeof aiChatRequestSchema>;
export type AIModelResponse = z.TypeOf<typeof aiModelSchema>;
export type AIModelListResponse = z.TypeOf<typeof aiModelsListSchema>;
