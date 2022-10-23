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

    return await prisma.$transaction([
      prisma.message_TownSquare.delete({ where: { id: thread?.messageId } }),
      prisma.messageThread_TownSquare.delete({ where: { id } }),
    ]);
  }
}
