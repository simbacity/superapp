import { Post_MiniBlog } from "@prisma/client";

export type RequestParamsCreate = {
  title: string;
  content: string;
};

export type ResponseParamsCreate = Post_MiniBlog;
