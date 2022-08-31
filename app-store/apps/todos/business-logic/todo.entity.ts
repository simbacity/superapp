import { TodoCreateRequest, TodoUpdateRequest } from "@app-store/apps/todos/api-contracts/todo.schema";
import ForbiddenError from "@app-store/shared/helpers/errors/ForbiddenError";
import prisma from "@app-store/shared/helpers/prisma";

export default class TodoEntity {
  async find(id: string, userId: string) {
    const todo = await prisma.post_Todo.findUnique({ where: { id } });

    if (todo?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return todo;
  }

  async create(params: TodoCreateRequest, userId: string) {
    const { title, content, status, category, priority, dueDate } = params;

    const response = await prisma.post_Todo.create({
      data: {
        title,
        content,
        userId,
        status,
        category,
        priority,
        dueDate,
      },
    });

    return response;
  }

  async update(params: TodoUpdateRequest, userId: string) {
    const { title, content, status, category, priority, dueDate } = params;

    const todo = await this.find(params.id, userId);

    const response = await prisma.post_Todo.update({
      where: { id: todo.id },
      data: {
        title,
        content,
        status,
        category,
        priority,
        dueDate,
      },
    });

    return response;
  }

  async list(userId: string) {
    return prisma.post_Todo.findMany({ where: { userId } });
  }

  async delete(id: string, userId: string) {
    const todo = await this.find(id, userId);

    if (todo?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return await prisma.post_Todo.delete({ where: { id } });
  }
}
