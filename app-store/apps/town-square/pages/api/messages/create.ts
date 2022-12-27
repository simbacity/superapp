import {
  messageRequestSchema,
  MessageDefaultResponse,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import fs from "node:fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new MessageEntity();

  const formData: Promise<{ fields: formidable.Fields; files: formidable.Files }> = new Promise(
    (resolve, reject) => {
      const form = formidable({
        uploadDir: "public/images",
        keepExtensions: true,
        multiples: false,
        allowEmptyFiles: true,
      }); // save the file locally
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    }
  );

  try {
    // formidable throws error if uploadDir doesn't exist
    if (!fs.existsSync("public/images")) {
      fs.mkdirSync("public/images");
    }

    const { fields, files } = await formData;
    const data = {
      content: fields.content,
      threadId: fields.threadId,
      imageAttachment: files.imageAttachment,
    };
    const requestBody = messageRequestSchema.parse(data);
    const response: MessageDefaultResponse = await entity.create(requestBody, session.user.id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
