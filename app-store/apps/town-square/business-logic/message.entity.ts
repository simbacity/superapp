import {
  MessageQueryParams,
  MessageRequest,
  MessageResponse,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import prisma from "@app-store/shared/utils/prisma";

export default class MessageEntity {
  async find(id: string, userId: string) {
    const message = await prisma.message_TownSquare.findUnique({ where: { id }, include: { user: true } });

    if (message?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }
    return message;
  }

  private async createMessageInThread(params: MessageRequest, userId: string) {
    const { content } = params;
    const response = await prisma.message_TownSquare.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
        thread: {
          connectOrCreate: {
            create: {
              messageId: params.messageId,
            },
            where: {
              id: params.threadId,
              messageId: params.messageId,
            },
          },
        },
      },
    });

    return response;
  }

  private async createMessage(params: MessageRequest, userId: string) {
    const { content } = params;
    return await prisma.message_TownSquare.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async create(params: MessageRequest, userId: string) {
    if (params.messageId || params.threadId) {
      return await this.createMessageInThread(params, userId);
    }
    return await this.createMessage(params, userId);
  }

  private getReplyCount(messageId: string, data: Omit<MessageResponse, "replyCount">[]) {
    return data.filter((message) => {
      if (message.thread) {
        return message.thread.messageId === messageId;
      }
    }).length;
  }

  async list(query: Record<string, string | string[]>) {
    const cursor = Array.isArray(query.cursor) ? query.cursor[0] : query.cursor;
    const pageSize = Array.isArray(query.pageSize) ? query.pageSize[0] : query.pageSize;

    const _query: MessageQueryParams = {
      take: parseInt(pageSize, 10),
      include: {
        thread: {
          select: {
            id: true,
            messageId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    };

    // loadmore/infinite query
    if (cursor) {
      _query.cursor = { id: cursor };
      _query.skip = 1;
    }

    const response = await prisma.message_TownSquare.findMany(_query);
    return response.map((message) => ({
      ...message,
      replyCount: this.getReplyCount(message.id, response),
    }));
  }

  async delete(id: string, userId: string) {
    const message = await this.find(id, userId);
    const thread = await prisma.messageThread_TownSquare.findUnique({
      where: {
        messageId: message.id,
      },
    });

    if (message?.userId !== userId) {
      throw new Error("Forbidden");
    }

    // delete thread if message is main message of thread
    if (thread) {
      return await prisma.$transaction([
        prisma.messageThread_TownSquare.delete({ where: { id: thread.id } }),
        prisma.message_TownSquare.delete({ where: { id } }),
      ]);
    }

    return prisma.message_TownSquare.delete({ where: { id } });
  }
}
