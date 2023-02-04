import { z } from "zod";

export const postCreateSchema = z.object({
  content: z.string().min(1),
  threadId: z.string().optional(),
  userId: z.string().optional(),
  isReply: z.boolean().optional(),
});

export const postListSchema = z.object({
  cursor: z.string().or(z.array(z.string())).optional(),
  pageSize: z.string().or(z.array(z.string())),
});

export type PostCreateParams = z.TypeOf<typeof postCreateSchema>;
export type PostListParams = z.TypeOf<typeof postListSchema>;
