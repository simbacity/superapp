import HttpError from "@app-store/shared/utils/errors/HttpError";
import AppStoreApiProxyEntity from "@business-logic/app-store-api-proxy.entity";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const entity = new AppStoreApiProxyEntity();

  try {
    const { apiHandler, id } = await entity.run(req.query.args);
    req.query.id = id;
    return apiHandler(req, res);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
  }
}
