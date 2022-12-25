import { PostRequest } from "@app-store/apps/subscriptions/api-contracts/post.schema";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import prisma from "@app-store/shared/utils/prisma";

export default class PostEntity {
  async find(id: string, userId: string) {
    const post = await prisma.subscriptions_Post.findUnique({ where: { id } });

    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return post;
  }

  async create(params: PostRequest, userId: string) {
    const { intro, title, content, scheduledAt } = params;

    const response = await prisma.subscriptions_Post.create({
      data: {
        intro,
        title,
        content,
        scheduledAt: scheduledAt || "",
        userId,
      },
    });

    return response;
  }

  async update(params: PostRequest, postId: string, userId: string) {
    const { intro, title, content } = params;

    const post = await this.find(postId, userId);

    const response = await prisma.subscriptions_Post.update({
      where: { id: post.id },
      data: {
        intro,
        title,
        content,
        userId,
      },
    });

    return response;
  }

  async list(userId: string) {
    return prisma.subscriptions_Post.findMany({ where: { userId } });
  }

  async delete(id: string, userId: string) {
    const post = await this.find(id, userId);

    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return prisma.subscriptions_Post.delete({ where: { id } });
  }
}
