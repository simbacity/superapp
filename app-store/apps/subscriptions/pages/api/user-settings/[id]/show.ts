import { UserSettingsResponse } from "@app-store/apps/subscriptions/api-contracts/usersettings.schema";
import UserSettingsEntity from "@app-store/apps/subscriptions/business-logic/usersettings";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new UserSettingsEntity();

  try {
    const response: UserSettingsResponse = await entity.find(session.user.id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
