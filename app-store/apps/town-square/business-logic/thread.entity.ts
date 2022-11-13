import { ThreadRequest } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import NotFoundError from "@app-store/shared/utils/errors/NotFoundError";
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

    if (!thread) {
      throw new NotFoundError("Not found");
    }

    return thread;
  }

  async create(params: ThreadRequest) {
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

  async delete(id: string, userId: string) {
    const messageEntity = new MessageEntity();
    const thread = await this.find(id);
    const mainMessage = await messageEntity.find(thread.messageId);

    if (mainMessage?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    const response = await prisma.$transaction([
      prisma.message_TownSquare.delete({ where: { id: mainMessage.id } }),
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
