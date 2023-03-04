import type { MessageListResponse } from "../../../api-contracts/message.schema";
import { messageListRequestSchema } from "../../../api-contracts/message.schema";
import MessageEntity from "../../../business-logic/message.entity";
import HttpError from "../../../../../shared/utils/errors/HttpError";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new MessageEntity();

  try {
    const parsedQuery = messageListRequestSchema.parse(req.query);
    const response: MessageListResponse = await entity.list(parsedQuery);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
    throw error;
  }
}
