import HttpError from "@app-store/shared/utils/errors/HttpError";
import BodyParseEntity from "@business-logic/BodyParser.entity";
import AppStoreApiProxyEntity from "@business-logic/app-store-api-proxy.entity";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface NextApiRequestWithFile extends NextApiRequest {
  files: any;
}

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  const entity = new AppStoreApiProxyEntity();
  const bodyParser = new BodyParseEntity();

  if (req.headers["content-type"] && req.headers["content-type"].indexOf("multipart/form-data") !== -1) {
    const { fields, files } = await bodyParser.parseRequestFormData(req);
    req.body = fields;
    req.files = files;
  }

  if (req.headers["content-type"] && req.headers["content-type"].indexOf("application/json") !== -1) {
    req.body = await bodyParser.parseRequestBufferData(req);
  }

  try {
    const { apiHandler, id } = await entity.run(req.query.args);
    req.query.id = id;
    return apiHandler(req, res);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
  }
}
