import prisma from "@app-store/shared/utils/prisma";

export default class InviteCodeEntity {
  async find(token: string) {
    return prisma.inviteCode.findUnique({
      where: {
        token,
      },
    });
  }
}
