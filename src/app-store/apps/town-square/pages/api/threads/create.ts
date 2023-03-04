import type { ThreadDefaultResponse } from "../../../api-contracts/thread.schema";
import { threadRequestSchema } from "../../../api-contracts/thread.schema";
import ThreadEntity from "../../../business-logic/thread.entity";
import HttpError from "../../../../../shared/utils/errors/HttpError";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new ThreadEntity();

  try {
    const requestBody = threadRequestSchema.parse(req.body);
    const response: ThreadDefaultResponse = await entity.create(requestBody);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
    throw error;
  }
}
