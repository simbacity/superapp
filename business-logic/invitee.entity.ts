import { InviteeRequest } from "@api-contracts/invitee.schema";
import NotFoundError from "@app-store/shared/utils/errors/NotFoundError";
import prisma from "@app-store/shared/utils/prisma";
import InviteCodeEntity from "@business-logic/invite-code.entity";

export default class InviteeEntity {
  async create(params: InviteeRequest) {
    const { token, email } = params;

    const existingInvitee = await this.find(email);
    if (existingInvitee) return { ...existingInvitee, token };

    const inviteCode = await new InviteCodeEntity().find(token);
    if (!inviteCode?.valid) throw new NotFoundError("Not found");

    const invitee = await this.createInvitee(email);

    const response = { ...invitee, token };
    return response;
  }

  async find(email: string) {
    return prisma.invitee.findUnique({
      where: {
        email,
      },
    });
  }

  async isInvited(email: string) {
    const invitee = await this.find(email);
    return Boolean(invitee);
  }

  async createInvitee(email: string) {
    return prisma.invitee.create({
      data: {
        email,
      },
    });
  }
}
