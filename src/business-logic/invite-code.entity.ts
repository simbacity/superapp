import { prisma } from "@server/db";

export default class InviteCodeEntity {
  async find(token: string) {
    return prisma.inviteCode.findUnique({
      where: {
        token,
      },
    });
  }
}
