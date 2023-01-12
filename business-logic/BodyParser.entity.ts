import formidable from "formidable";
import { NextApiRequest } from "next";
import type { Readable } from "node:stream";

export default class CustomBodyParser {
  async parseRequestFormData(
    req: NextApiRequest
  ): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    return new Promise((resolve, reject) => {
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
    });
  }

  async parseRequestBufferData(readable: Readable) {
    const chunks = [];
    for await (const chunk of readable) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }

    const reqBuffer = Buffer.concat(chunks);
    const stringifiedReqBody = reqBuffer.toString();

    return JSON.parse(stringifiedReqBody);
  }
}