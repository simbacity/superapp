import { inviteeRequestSchema, InviteeResponse } from "@api-contracts/invitee.schema";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import InviteeEntity from "@business-logic/invitee.entity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const entity = new InviteeEntity();

  try {
    const requestBody = inviteeRequestSchema.parse(req.body);
    const response: InviteeResponse = await entity.create(requestBody);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
