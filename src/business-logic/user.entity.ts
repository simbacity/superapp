import { prisma } from "@server/db";

export default class UserEntity {
  async find(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
