import type { PushSubscriptionResponse } from "@api-contracts/push-subscription.schema";
import { pushSubscriptionRequestSchema } from "@api-contracts/push-subscription.schema";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import PushSubscriptionEntity from "@business-logic/push-subscription.entity";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new PushSubscriptionEntity();

  try {
    const requestBody = pushSubscriptionRequestSchema.parse(req.body);
    const response: PushSubscriptionResponse = await entity.create(
      requestBody,
      session.user.id
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.code).json(error.message);
    throw error;
  }
}
