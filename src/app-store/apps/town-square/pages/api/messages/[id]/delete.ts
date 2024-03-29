import type { MessageDefaultResponse } from "../../../../api-contracts/message.schema";
import MessageEntity from "../../../../business-logic/message.entity";
import HttpError from "../../../../../../shared/utils/errors/HttpError";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");
  if (!req.query.id) return res.status(400).json("Missing id parameter");

  const entity = new MessageEntity();

  try {
    const id = req.query.id.toString();
    const response: MessageDefaultResponse = await entity.delete(
      id,
      session.user.id
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
    throw error;
  }
}
