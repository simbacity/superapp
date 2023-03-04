import type { ThreadRequest } from "../api-contracts/thread.schema";
import MessageEntity from "./message.entity";
import ForbiddenError from "../../../shared/utils/errors/ForbiddenError";
import NotFoundError from "../../../shared/utils/errors/NotFoundError";
import { prisma } from "@server/db";

export default class ThreadEntity {
  async find(id: string) {
    const thread = await prisma.thread_TownSquare.findUnique({
      where: { id },
      include: {
        messages: {
          include: { user: { select: { id: true, image: true, name: true } } },
          where: { isReply: true },
        },
        mainMessage: {
          include: { user: { select: { id: true, image: true, name: true } } },
        },
      },
    });

    if (!thread) {
      throw new NotFoundError("Not found");
    }

    return thread;
  }

  async create(params: ThreadRequest) {
    const thread = await prisma.thread_TownSquare.create({
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
    const threads = await prisma.thread_TownSquare.findMany({
      include: {
        messages: {
          include: { user: { select: { id: true, image: true, name: true } } },
          where: { isReply: true },
        },
        mainMessage: {
          include: { user: { select: { id: true, image: true, name: true } } },
        },
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
      prisma.thread_TownSquare.delete({ where: { id } }),
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
