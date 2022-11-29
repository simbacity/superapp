import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  intro: z.string(),
  title: z.string(),
  content: z.string(),
  scheduledAt: z.string(),
  createdAt: z.date().or(z.string()),
});

export const postListSchema = z.array(postSchema);

export const postRequestSchema = z.object({
  intro: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  scheduledAt: z.string().optional(),
});

export type PostResponse = z.TypeOf<typeof postSchema>;
export type PostListResponse = z.TypeOf<typeof postListSchema>;
export type PostRequest = z.TypeOf<typeof postRequestSchema>;
