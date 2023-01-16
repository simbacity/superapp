import HttpError from "@app-store/shared/utils/errors/HttpError";
import AppStoreApiProxyEntity from "@business-logic/app-store-api-proxy.entity";
import BodyParseEntity from "@business-logic/body-parser.entity";
import { NextApiRequestWithFile } from "@business-logic/body-parser.entity";
import { NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function appStoreApiProxyEntity(req: NextApiRequestWithFile, res: NextApiResponse) {
  const entity = new AppStoreApiProxyEntity();
  const bodyParserEntity = new BodyParseEntity();

  const parsedRequest = await bodyParserEntity.parse(req);

  req = parsedRequest;

  try {
    const { apiHandler, id } = await entity.run(req.query.args);
    req.query.id = id;
    return apiHandler(req, res);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
  }
}
