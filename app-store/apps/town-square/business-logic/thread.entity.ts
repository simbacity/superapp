import { Thread } from "@app-store/apps/town-square/api-contracts/thread.schema";
import prisma from "@app-store/shared/utils/prisma";

export default class ThreadEntity {
  async find(id: string) {
    const thread = await prisma.messageThread_TownSquare.findUnique({
      where: { id },
      include: {
        messages: {
          include: { user: { select: { id: true, image: true, name: true } } },
          where: { isReply: true },
        },
        mainMessage: { include: { user: { select: { id: true, image: true, name: true } } } },
      },
    });

    return thread;
  }

  async create(params: Thread) {
    const thread = await prisma.messageThread_TownSquare.create({
      data: {
        messageId: params.messageId,
      },
    });

    // Update main message with its newly created thread
    await prisma.message_TownSquare.update({
      where: {
        id: params.messageId,
      },
      data: {
        threadId: thread.id,
      },
    });

    return thread;
  }

  async list() {
    const threads = await prisma.messageThread_TownSquare.findMany({
      include: {
        messages: {
          include: { user: { select: { id: true, image: true, name: true } } },
          where: { isReply: true },
        },
        mainMessage: { include: { user: { select: { id: true, image: true, name: true } } } },
      },
    });

    return threads;
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
