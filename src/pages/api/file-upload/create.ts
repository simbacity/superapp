import type { ServerSideFile } from "@api-contracts/file-upload.schema";
import FileUploadEntity from "@business-logic/file-upload.entity";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import formidable from "formidable";
import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { FILE_FOLDER_PATH_FOR_DEV_MODE } from "@app-store/shared/utils/config/constants";
import fs from "node:fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new FileUploadEntity();

  try {
    const { files } = await parseRequestFile(req);
    const data = files as ServerSideFile;
    const response: string = await entity.save(data, "messages");
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
    throw error;
  }
}

function parseRequestFile(
  req: NextApiRequest
): Promise<{ files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const options: formidable.Options = {
      keepExtensions: true,
      multiples: false,
      allowEmptyFiles: true,
    };

    if (!IS_PRODUCTION) {
      // save file to public folder in development
      options.uploadDir = `public/${FILE_FOLDER_PATH_FOR_DEV_MODE}`;

      // formidable throws error if uploadDir doesn't exist (when saving to local directory)
      if (!fs.existsSync(`public/${FILE_FOLDER_PATH_FOR_DEV_MODE}`)) {
        fs.mkdirSync(`public/${FILE_FOLDER_PATH_FOR_DEV_MODE}`);
      }
    }

    const form = formidable(options);

    form.parse(req, (err, _fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ files });
    });
  });
}
