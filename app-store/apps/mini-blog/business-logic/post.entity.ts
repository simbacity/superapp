import { PostRequest } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import prisma from "@app-store/shared/utils/prisma";

export default class PostEntity {
  async find(id: string, userId: string) {
    const post = await prisma.post_MiniBlog.findUnique({ where: { id } });

    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return post;
  }

  async create(params: PostRequest, userId: string) {
    const { title, content } = params;

    const response = await prisma.post_MiniBlog.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return response;
  }

  async update(params: PostRequest, postId: string, userId: string) {
    const { title, content } = params;

    const post = await this.find(postId, userId);

    const response = await prisma.post_MiniBlog.update({
      where: { id: post.id },
      data: {
        title,
        content,
      },
    });

    return response;
  }

  async list(userId: string) {
    return prisma.post_MiniBlog.findMany({ where: { userId } });
  }

  async delete(id: string, userId: string) {
    const post = await this.find(id, userId);

    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return prisma.post_MiniBlog.delete({ where: { id } });
  }
}
