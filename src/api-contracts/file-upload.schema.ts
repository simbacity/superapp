import { z } from "zod";

export const serverSideFileSchema = z.object({
  file: z
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

export type ServerSideFile = z.TypeOf<typeof serverSideFileSchema>;
