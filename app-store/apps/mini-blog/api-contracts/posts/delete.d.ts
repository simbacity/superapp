import { Post_MiniBlog } from "@prisma/client";

export type RequestParamsDelete = {
  id: string;
};

export type ResponseParamsDelete = Post_MiniBlog;
