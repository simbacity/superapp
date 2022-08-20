import {
  RequestParamsCreate,
  ResponseParamsCreate,
} from "@app-store/apps/mini-blog/api-contracts/posts/create";
import { ResponseParamsDelete } from "@app-store/apps/mini-blog/api-contracts/posts/delete";
import { ResponseParamsList } from "@app-store/apps/mini-blog/api-contracts/posts/list";
import { ResponseParamsShow } from "@app-store/apps/mini-blog/api-contracts/posts/show";
import {
  RequestParamsUpdate,
  ResponseParamsUpdate,
} from "@app-store/apps/mini-blog/api-contracts/posts/update";
import ForbiddenError from "@app-store/shared/helpers/errors/ForbiddenError";
import prisma from "@app-store/shared/helpers/prisma";

export default class PostEntity {
  async find(id: string, userId: string) {
    const post = await prisma.post_MiniBlog.findUnique({ where: { id } });
    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    const response: ResponseParamsShow = post;
    return response;
  }

  async create(params: RequestParamsCreate, userId: string) {
    const { title, content } = params;

    const response: ResponseParamsCreate = await prisma.post_MiniBlog.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return response;
  }

  async update(params: RequestParamsUpdate, userId: string) {
    const { title, content } = params;

    const post = await this.find(params.id, userId);

    const response: ResponseParamsUpdate = await prisma.post_MiniBlog.update({
      where: { id: post.id },
      data: {
        title,
        content,
      },
    });

    return response;
  }

  async list(userId: string) {
    const response: ResponseParamsList = await prisma.post_MiniBlog.findMany({ where: { userId } });
    return response;
  }

  async delete(id: string, userId: string) {
    const post = await this.find(id, userId);

    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    const response: ResponseParamsDelete = await prisma.post_MiniBlog.delete({ where: { id } });
    return response;
  }
}
