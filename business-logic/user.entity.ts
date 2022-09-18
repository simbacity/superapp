import prisma from "@app-store/shared/utils/prisma";

export default class UserEntity {
  async find(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
