import { Invitee } from "@prisma/client";

export type RequestParams = {
  token: string;
  email: string;
};

export type ResponseParams = Invitee;
