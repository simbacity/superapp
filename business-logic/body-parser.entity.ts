import formidable from "formidable";
import { NextApiRequest } from "next";
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
      req.body = await this.parseRequestBufferData(req);
    }

    return req;
  }

  private async parseRequestFormData(
    req: NextApiRequest
  ): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    return new Promise((resolve, reject) => {
      const form = formidable({
        keepExtensions: true,
        multiples: false,
        allowEmptyFiles: true,
      });
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

    return JSON.parse(stringifiedReqBody);
  }
}
