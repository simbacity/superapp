import { Post_MiniBlog } from "@prisma/client";

export type RequestParamsShow = {
  id: string;
};

export type ResponseParamsShow = Post_MiniBlog;
