import prisma from "@app-store/shared/utils/prisma";

export default class MessageThreadEntity {
  async find(id: string) {
    return await prisma.messageThread_TownSquare.findUnique({
      where: { id },
      include: {
        messages: { include: { user: { select: { id: true, image: true, name: true } } } },
        mainMessage: { include: { user: { select: { id: true, image: true, name: true } } } },
      },
    });
  }
}
