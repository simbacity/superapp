import prisma from "@app-store/shared/helpers/prisma";

export default class UserEntity {
  async find(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
