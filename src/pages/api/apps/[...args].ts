import HttpError from "../../../app-store/shared/utils/errors/HttpError";
import AppStoreApiProxyEntity from "@business-logic/app-store-api-proxy.entity";
import BodyParserEntity from "@business-logic/body-parser.entity";
import type { NextApiRequestWithFile } from "@business-logic/body-parser.entity";
import type { NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  const appStoreApiProxyEntity = new AppStoreApiProxyEntity();
  const bodyParserEntity = new BodyParserEntity();

  const parsedRequest = await bodyParserEntity.parse(req);

  try {
    const { apiHandler, id } = await appStoreApiProxyEntity.run(
      parsedRequest.query.args
    );
    parsedRequest.query.id = id;
    return apiHandler(parsedRequest, res);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
  }
}
