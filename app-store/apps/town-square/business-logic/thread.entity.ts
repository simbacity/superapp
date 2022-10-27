import prisma from "@app-store/shared/utils/prisma";

export default class ThreadEntity {
  async find(id: string, findByMainMessageId?: boolean) {
    if (findByMainMessageId) {
      return await this.findByMainMessageId(id);
    } else {
      return await this.findById(id);
    }
  }

  private async findById(id: string) {
    const thread = await prisma.messageThread_TownSquare.findUnique({
      where: { id },
      include: {
        messages: { include: { user: { select: { id: true, image: true, name: true } } } },
        mainMessage: { include: { user: { select: { id: true, image: true, name: true } } } },
      },
    });

    return thread;
  }

  private async findByMainMessageId(id: string) {
    const thread = await prisma.messageThread_TownSquare.findUnique({
      where: { messageId: id },
      include: {
        messages: { include: { user: { select: { id: true, image: true, name: true } } } },
        mainMessage: { include: { user: { select: { id: true, image: true, name: true } } } },
      },
    });

    return thread;
  }

  async delete(id: string) {
    const thread = await this.find(id);

    const response = await prisma.$transaction([
      prisma.message_TownSquare.delete({ where: { id: thread?.messageId } }),
      prisma.messageThread_TownSquare.delete({ where: { id } }),
    ]);

    return {
      id: response[1].id,
      messageId: response[1].messageId,
      mainMessage: response[0],
      messages: [response[0]],
      createdAt: response[1].createdAt,
    };
  }
}
