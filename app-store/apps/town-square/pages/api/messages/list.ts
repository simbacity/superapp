import { MessageListResponse } from "@app-store/apps/town-square/api-contracts/message.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new MessageEntity();

  const { cursor, pageSize } = req.query;
  const cursorFilter = Array.isArray(cursor) ? cursor[0] : cursor;
  const pageSizeFilter = Array.isArray(pageSize) ? pageSize[0] : pageSize;

  try {
    const response: MessageListResponse = await entity.list(parseInt(pageSizeFilter, 10), cursorFilter);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
