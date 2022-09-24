import prisma from "@app-store/shared/utils/prisma";

export default class MessageThreadEntity {
  async find(id: string) {
    const thread = await prisma.messageThread_TownSquare.findUnique({ where: { id } });

    const mainMessage = await prisma.message_TownSquare.findUnique({ where: { id: thread?.messageId } });

    return { ...thread, mainMessage };
  }
}
