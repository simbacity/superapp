import { Message } from "@app-store/apps/town-square/api-contracts/message.schema";
import { Thread } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageThreadEntity from "@app-store/apps/town-square/business-logic/thread.entity";
import { User } from "@app-store/apps/town-square/components/Message";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type ThreadResponse = Thread & {
  messages: (Message & User)[];
  mainMessage: (Message & User) | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new MessageThreadEntity();

  try {
    const id = req.query.id.toString();
    const response: ThreadResponse | null = await entity.find(id, !!req.query.findByMainMessageId);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
