import {
  messageRequestSchema,
  MessageDefaultResponse,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import { NextApiRequestWithFile } from "@pages/api/apps/[...args]";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import fs from "node:fs";

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new MessageEntity();

  try {
    // formidable throws error if uploadDir doesn't exist
    if (!fs.existsSync("public/images")) {
      fs.mkdirSync("public/images");
    }

    const data = {
      content: req.body.content,
      threadId: req.body.threadId,
      imageAttachment: req.files.imageAttachment,
    };

    const requestBody = messageRequestSchema.parse(data);
    const response: MessageDefaultResponse = await entity.create(requestBody, session.user.id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
