import { z } from "zod";

export const isClientSide = typeof window !== "undefined";

export const messageDefaultSchema = z.object({
  id: z.string(),
  threadId: z.string().nullable(),
});

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  imageAttachment: z.string().nullable(),
  isReply: z.boolean(),
  threadId: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date().or(z.string()),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  replyCount: z.number().optional(),
});

export const messageListRequestSchema = z.object({
  cursor: z.string().or(z.array(z.string())).optional(),
  pageSize: z.string().or(z.array(z.string())),
});

export const messageListSchema = z.array(messageSchema);

export const serverSideImageSchema = z.object({
  imageFile: z
    .object({
      filepath: z.string(),
      mimetype: z.string(),
      newFilename: z.string(),
      originalFilename: z.string(),
      size: z.number(),
      lastModifiedDate: z.date(),
    })
    .optional(),
});

export const messageRequestSchema = z.object({
  content: z.string().min(1),
  imageAttachment: isClientSide
    ? z.instanceof(File).or(z.instanceof(FileList))
    : z.optional(serverSideImageSchema),
  threadId: z.string().optional(),
  userId: z.string().optional(),
  isReply: z.boolean().optional(),
});

export type MessageDefaultResponse = z.TypeOf<typeof messageDefaultSchema>;
export type MessageResponse = z.TypeOf<typeof messageSchema>;
export type MessageListResponse = z.TypeOf<typeof messageListSchema>;
export type MessageRequest = z.TypeOf<typeof messageRequestSchema>;
export type MessageListRequest = z.TypeOf<typeof messageListRequestSchema>;
export type ServerSideImage = z.TypeOf<typeof serverSideImageSchema>;
