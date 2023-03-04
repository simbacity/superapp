import type { MessageDefaultResponse } from "../../../api-contracts/message.schema";
import { messageRequestSchema } from "../../../api-contracts/message.schema";
import MessageEntity from "../../../business-logic/message.entity";
import HttpError from "../../../../../shared/utils/errors/HttpError";
import type { NextApiRequestWithFile } from "@business-logic/body-parser.entity";
import type { NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new MessageEntity();

  try {
    const data = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      content: req.body.content as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      threadId: req.body.threadId as string,
      imageAttachment: req.files,
    };

    const requestBody = messageRequestSchema.parse(data);
    const response: MessageDefaultResponse = await entity.create(
      requestBody,
      session.user.id
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
    throw error;
  }
}
