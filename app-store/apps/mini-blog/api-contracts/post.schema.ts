import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const postListSchema = z.array(postSchema);

export const postCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const postUpdateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export const postDeleteSchema = z.object({
  id: z.string(),
});

export type PostResponse = z.TypeOf<typeof postSchema>;
export type PostListResponse = z.TypeOf<typeof postListSchema>;
export type PostUpdateRequest = z.TypeOf<typeof postUpdateSchema>;
export type PostCreateRequest = z.TypeOf<typeof postCreateSchema>;
export type PostDeleteRequest = z.TypeOf<typeof postDeleteSchema>;
