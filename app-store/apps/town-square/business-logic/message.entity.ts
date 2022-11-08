import { MessageRequest } from "@app-store/apps/town-square/api-contracts/message.schema";
import PushNotificationEntity from "@app-store/shared/business-logic/push-notification.entity";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import NotFoundError from "@app-store/shared/utils/errors/NotFoundError";
import prisma from "@app-store/shared/utils/prisma";
import { User } from "@prisma/client";

type MessageListQuerySchema = {
  take: number;
  cursor?: { id: string };
  skip?: number;
  where: { isReply: boolean };
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

  async create(params: MessageRequest, userId: string) {
    const createMessage = params.threadId ? this.createReply : this.createMessage;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const messageTitle = user?.name || "New message";

    const response = await createMessage(params, userId);
    await this.sendPushNotificationToAllOtherUsers(userId, messageTitle, params.content);
    return response;
  }

  async list(query: Record<string, string | string[]>) {
    const cursor = Array.isArray(query.cursor) ? query.cursor[0] : query.cursor;
    const pageSize = Array.isArray(query.pageSize) ? query.pageSize[0] : query.pageSize;

    const _query: MessageListQuerySchema = {
      take: parseInt(pageSize, 10),
      where: {
        isReply: false,
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

  private async createReply(params: MessageRequest, userId: string) {
    const { content, isReply = true } = params;
    const response = await prisma.message_TownSquare.create({
      data: {
        content,
        isReply,
        user: {
          connect: {
            id: userId,
          },
        },
        thread: {
          connect: {
            id: params.threadId,
          },
        },
      },
    });

    return response;
  }

  private async createMessage(params: MessageRequest, userId: string) {
    const { content, isReply = false } = params;
    const response = await prisma.message_TownSquare.create({
      data: {
        content,
        isReply,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return response;
  }

  private async sendPushNotificationToAllOtherUsers(currentUserId: string, title: string, body: string) {
    const users = await prisma.user.findMany();
    const userIds = users.map((user: User) => user.id).filter((id: string) => id !== currentUserId);

    const pushNotification = new PushNotificationEntity();
    pushNotification.send(userIds, title, body);
  }
}
