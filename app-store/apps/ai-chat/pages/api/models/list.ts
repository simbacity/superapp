import { AIModelListResponse } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import AIChatEntity from "@app-store/apps/ai-chat/business-logic/ai-chat.entity";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new AIChatEntity();

  try {
    const response: AIModelListResponse = await entity.listModels();
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
