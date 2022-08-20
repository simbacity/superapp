import { RequestParams, ResponseParams } from "@api-contracts/invitees/create";
import HttpError from "@app-store/shared/helpers/errors/HttpError";
import InviteeEntity from "@business-logic/Invitee";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const entity = new InviteeEntity();

  try {
    const requestBody: RequestParams = req.body;
    const response: ResponseParams = await entity.create(requestBody);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
