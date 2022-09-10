import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const postListSchema = z.array(postSchema);

export const postRequestSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type PostResponse = z.TypeOf<typeof postSchema>;
export type PostListResponse = z.TypeOf<typeof postListSchema>;
export type PostRequest = z.TypeOf<typeof postRequestSchema>;
