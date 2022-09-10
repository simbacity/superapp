import { postRequestSchema, PostResponse } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import PostEntity from "@app-store/apps/mini-blog/business-logic/post.entity";
import HttpError from "@app-store/shared/helpers/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new PostEntity();

  try {
    const id = req.query.id.toString();
    const requestBody = postRequestSchema.parse(req.body);
    const response: PostResponse = await entity.update(requestBody, id, session.user.id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
