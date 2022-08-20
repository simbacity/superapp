import HttpError from "@app-store/shared/helpers/errors/HttpError";
import AppStoreApiProxyEntity from "@business-logic/AppStoreApiProxy";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const entity = new AppStoreApiProxyEntity();

  try {
    const apiHandler = await entity.run(req.query.args);
    return apiHandler(req, res);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
  }
}
