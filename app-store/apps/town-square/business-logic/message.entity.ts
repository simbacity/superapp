import { MessageRequest } from "@app-store/apps/town-square/api-contracts/message.schema";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import prisma from "@app-store/shared/utils/prisma";

export default class MessageEntity {
  async find(id: string, userId: string) {
    const message = await prisma.message_TownSquare.findUnique({ where: { id } });

    if (message?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }
    return message;
  }

  async create(params: MessageRequest, userId: string) {
    const { content } = params;

    if (params.messageId || params.threadId) {
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
                messageId: params.messageId || "",
              },
              where: {
                id: params.threadId,
              },
            },
          },
        },
      });

      return response;
    }

    const response = await prisma.message_TownSquare.create({
      data: {
        content,
        userId,
      },
    });

    return response;
  }

  async list(pageSize: number, cursor: string) {
    if (!cursor) {
      // first query
      return prisma.message_TownSquare.findMany({
        take: pageSize,
        include: {
          thread: {
            select: {
              messageId: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    } else {
      // subsequent queries
      return prisma.message_TownSquare.findMany({
        take: pageSize,
        skip: 1,
        cursor: { id: cursor },
        include: {
          thread: {
            select: {
              messageId: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }
  }

  async delete(id: string, userId: string) {
    const message = await this.find(id, userId);

    if (message?.userId !== userId) {
      throw new Error("Forbidden");
    }

    return prisma.message_TownSquare.delete({ where: { id } });
  }
}
