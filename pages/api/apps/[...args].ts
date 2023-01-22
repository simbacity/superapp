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

  try {
    const { apiHandler, id } = await entity.run(parsedRequest.query.args);
    parsedRequest.query.id = id;
    return apiHandler(parsedRequest, res);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
  }
}
