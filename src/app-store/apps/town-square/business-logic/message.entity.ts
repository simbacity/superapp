import type {
  MessageRequest,
  MessageListRequest,
  ServerSideImage,
} from "../api-contracts/message.schema";
import ImageStorageEntity from "./image-storage.entity";
import sanitizeContent from "../utils/sanitize";
import PushNotificationEntity from "../../../shared/business-logic/push-notification.entity";
import ForbiddenError from "../../../shared/utils/errors/ForbiddenError";
import NotFoundError from "../../../shared/utils/errors/NotFoundError";
import { prisma } from "@server/db";
import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { getBaseUrl } from "../../../../utils/api";

type MessageListQuerySchema = {
  orderBy: {
    createdAt: typeof Prisma.SortOrder.desc;
  };
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
    thread: {
      select: {
        _count: {
          select: {
            messages: boolean;
          };
        };
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
    const createMessage = params.threadId
      ? this.createReply
      : this.createMessage;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const messageTitle = user?.name || "New message";

    const baseUrl = getBaseUrl();
    const response = await createMessage(params, userId);
    await this.sendPushNotificationToAllOtherUsers(
      userId,
      messageTitle,
      params.content,
      response.threadId
        ? `${baseUrl}/apps/town-square/threads/${response.threadId}`
        : `${baseUrl}/apps/town-square`
    );
    return response;
  }

  async list(query: MessageListRequest) {
    const cursor = Array.isArray(query.cursor) ? query.cursor[0] : query.cursor;
    const pageSize = Array.isArray(query.pageSize)
      ? query.pageSize[0] || "10"
      : query.pageSize;

    const _query: MessageListQuerySchema = {
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
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
        thread: {
          select: {
            _count: {
              select: {
                messages: true,
              },
            },
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
      id: message.id,
      content: message.content,
      imageAttachment: message.imageAttachment,
      isReply: message.isReply,
      threadId: message.threadId,
      userId: message.userId,
      createdAt: message.createdAt,
      replyCount: message.thread
        ? message.thread._count.messages - 1
        : undefined,
      user: message.user,
    }));
  }

  async delete(id: string, userId: string) {
    const message = await this.find(id);

    if (message?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return await prisma.message_TownSquare.delete({ where: { id } });
  }

  private createReply = async (params: MessageRequest, userId: string) => {
    const { content, isReply = true } = params;

    const sanitizedContent = sanitizeContent(content);
    const imageAttachment = params.imageAttachment as
      | ServerSideImage
      | undefined;
    const imageUrl = imageAttachment?.imageFile
      ? await this.saveToObjectStorage(imageAttachment)
      : undefined;

    const response = await prisma.message_TownSquare.create({
      data: {
        content: sanitizedContent,
        imageAttachment: imageUrl,
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
  };

  private createMessage = async (params: MessageRequest, userId: string) => {
    const { content, isReply = false } = params;

    const sanitizedContent = sanitizeContent(content);
    const imageAttachment = params.imageAttachment as
      | ServerSideImage
      | undefined;
    const imageUrl = imageAttachment?.imageFile
      ? await this.saveToObjectStorage(imageAttachment)
      : undefined;

    const response = await prisma.message_TownSquare.create({
      data: {
        content: sanitizedContent,
        imageAttachment: imageUrl,
        isReply,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return response;
  };

  private async sendPushNotificationToAllOtherUsers(
    currentUserId: string,
    title: string,
    body: string,
    url: string
  ) {
    const users = await prisma.user.findMany();
    const userIds = users
      .map((user: User) => user.id)
      .filter((id: string) => id !== currentUserId);

    const pushNotification = new PushNotificationEntity();
    return pushNotification.send(userIds, title, body, url);
  }

  private async saveToObjectStorage(file: ServerSideImage) {
    const imageStorageEntity = new ImageStorageEntity();

    const url = await imageStorageEntity.save(file);
    return url;
  }
}
