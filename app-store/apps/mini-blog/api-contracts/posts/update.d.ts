import { Post_MiniBlog } from "@prisma/client";

export type RequestParamsUpdate = {
  id: string;
  title?: string;
  content?: string;
};

export type ResponseParamsUpdate = Post_MiniBlog;
