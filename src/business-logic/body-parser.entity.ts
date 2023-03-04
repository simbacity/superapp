import { IS_PRODUCTION } from "../app-store/shared/utils/config/constants";
import { IMAGE_FOLDER_PATH_FOR_DEV_MODE } from "../app-store/shared/utils/config/constants";
import formidable from "formidable";
import fs from "fs";
import type { NextApiRequest } from "next";
import type { Readable } from "node:stream";

export interface NextApiRequestWithFile extends NextApiRequest {
  files: unknown;
}

export default class BodyParserEntity {
  async parse(req: NextApiRequestWithFile) {
    const contentType = req.headers["content-type"];

    if (contentType && contentType.includes("multipart/form-data")) {
      const { fields, files } = await this.parseRequestFormData(req);
      req.body = fields;
      req.files = files;
    } else if (contentType && contentType.includes("application/json")) {
      req.body = (await this.parseRequestBufferData(req)) as unknown;
    }

    return req;
  }

  private async parseRequestFormData(
    req: NextApiRequest
  ): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    return new Promise((resolve, reject) => {
      const options: formidable.Options = {
        keepExtensions: true,
        multiples: false,
        allowEmptyFiles: true,
      };

      if (!IS_PRODUCTION) {
        // save file to public folder in development
        options.uploadDir = `public/${IMAGE_FOLDER_PATH_FOR_DEV_MODE}`;

        // formidable throws error if uploadDir doesn't exist (when saving to local directory)
        if (!fs.existsSync(`public/${IMAGE_FOLDER_PATH_FOR_DEV_MODE}`)) {
          fs.mkdirSync(`public/${IMAGE_FOLDER_PATH_FOR_DEV_MODE}`);
        }
      }

      const form = formidable(options);
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });
  }

  private async parseRequestBufferData(readable: Readable) {
    const chunks = [];
    for await (const chunk of readable) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }

    const reqBuffer = Buffer.concat(chunks);
    const stringifiedReqBody = reqBuffer.toString();

    return JSON.parse(stringifiedReqBody) as { [key: string]: unknown };
  }
}
