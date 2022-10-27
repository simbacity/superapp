import { MessageRequest } from "@app-store/apps/town-square/api-contracts/message.schema";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import NotFoundError from "@app-store/shared/utils/errors/NotFoundError";
import prisma from "@app-store/shared/utils/prisma";

type MessageListQuerySchema = {
  take: number;
  cursor?: { id: string };
  skip?: number;
  where: { threadId: null };
  include: {
    user: {
      select: {
        id: boolean;
        name: boolean;
        image: boolean;
      };
    };
  };
};

export default class MessageEntity {
  async find(id: string) {
    const message = await prisma.message_TownSquare.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    if (!message) {
      throw new NotFoundError("Not Found");
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
              messageId: params.messageId || "",
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
    const response = await prisma.message_TownSquare.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return response;
  }

  async create(params: MessageRequest, userId: string) {
    if (params.messageId || params.threadId) {
      return await this.createMessageInThread(params, userId);
    }
    return await this.createMessage(params, userId);
  }

  async list(query: Record<string, string | string[]>) {
    const cursor = Array.isArray(query.cursor) ? query.cursor[0] : query.cursor;
    const pageSize = Array.isArray(query.pageSize) ? query.pageSize[0] : query.pageSize;

    const _query: MessageListQuerySchema = {
      take: parseInt(pageSize, 10),
      where: {
        threadId: null,
      },
      include: {
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
    return response;
  }

  async delete(id: string, userId: string) {
    const message = await this.find(id);

    if (message?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return await prisma.message_TownSquare.delete({ where: { id } });
  }
}
