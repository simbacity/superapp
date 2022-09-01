import { TodoCreateRequest, TodoUpdateRequest } from "@app-store/apps/todos/api-contracts/todo.schema";
import TodoEntity from "@app-store/apps/todos/business-logic/todo.entity";
import prisma from "@app-store/shared/helpers/prisma";
import { setup } from "@app-store/shared/helpers/tests/setup";
import { teardown } from "@app-store/shared/helpers/tests/teardown";
import { Post_Todo } from "@prisma/client";

describe("Todo", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#find", () => {
    it("finds todo", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();

      const result = await entity.create(requestParams, user.id);
      const todo = await entity.find(result.id, user.id);

      expect(todo.title).toBe(requestParams.title);
      expect(todo.content).toBe(requestParams.content);
      expect(todo.category).toBe(requestParams.category);
      expect(todo.priority).toBe(requestParams.priority);
      expect(todo.status).toBe(requestParams.status);
      expect(todo.dueDate).toStrictEqual(requestParams.dueDate);
    });

    it("throws error if todo is from a different user", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();

      const result = await entity.create(requestParams, user.id);

      await expect(async () => {
        await entity.find(result.id, "random_user_id");
      }).rejects.toThrowError("Forbidden");
    });
  });

  describe("#create", () => {
    it("creates todo", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();

      const result = await entity.create(requestParams, user.id);
      const todo = (await prisma.post_Todo.findUnique({ where: { id: result?.id } })) as Post_Todo;

      expect(todo.title).toBe(requestParams.title);
      expect(todo.content).toBe(requestParams.content);
      expect(todo.category).toBe(requestParams.category);
      expect(todo.priority).toBe(requestParams.priority);
      expect(todo.status).toBe(requestParams.status);
      expect(todo.dueDate).toStrictEqual(requestParams.dueDate);
    });
  });

  describe("#list", () => {
    it("lists todos", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();

      const createFirstTodo = entity.create(requestParams, user.id);
      const createSecondTodo = entity.create(requestParams, user.id);
      const createThirdTodo = entity.create(requestParams, user.id);

      await Promise.all([createFirstTodo, createSecondTodo, createThirdTodo]);

      const allTodos = await entity.list(user.id);

      expect(allTodos.length).toBe(3);
    });
  });

  describe("#update", () => {
    it("updates todo if todo is from user", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();
      const result = await entity.create(requestParams, user.id);

      const newParams: TodoUpdateRequest = {
        id: result.id,
        title: "New title",
        content: "New content",
        category: "New category",
        priority: "New priority",
        status: "New status",
        dueDate: new Date("December 25, 2023 00:00:00"),
      };

      await entity.update(newParams, user.id);

      const update = await prisma.post_Todo.findUnique({ where: { id: result.id } });

      expect(update?.title).toBe(newParams.title);
      expect(update?.content).toBe(newParams.content);
      expect(update?.category).toBe(newParams.category);
      expect(update?.status).toBe(newParams.status);
      expect(update?.priority).toBe(newParams.priority);
      expect(update?.dueDate).toStrictEqual(newParams.dueDate);
    });

    it("does not update todo if todo is from different user", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();
      const result = await entity.create(requestParams, user.id);

      const newParams: TodoUpdateRequest = {
        id: result.id,
        title: "New title",
        content: "New content",
        category: "New category",
        priority: "New priority",
        status: "New status",
        dueDate: new Date("December 25, 2023 00:00:00"),
      };

      await expect(async () => {
        await entity.update(newParams, "random_user_id");
      }).rejects.toThrowError("Forbidden");
    });
  });

  describe("#delete", () => {
    it("deletes todo if todo is from user", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();
      const result = await entity.create(requestParams, user.id);

      await entity.delete(result.id, user.id);

      const deleted = await prisma.post_Todo.findUnique({ where: { id: result.id } });

      expect(deleted).toBe(null);
    });

    it("does not delete todo if todo is from different user", async () => {
      const { user } = await setup();

      const requestParams: TodoCreateRequest = {
        title: "This is the title of the todo",
        content: "This is the content of the todo",
        category: "This is the category of the todo",
        priority: "This is the priority of the todo",
        status: "This is the priority of the todo",
        dueDate: new Date("December 25, 2022 00:00:00"),
      };

      const entity = new TodoEntity();
      const result = await entity.create(requestParams, user.id);

      await expect(async () => {
        await entity.delete(result.id, "random_user_id");
      }).rejects.toThrowError("Forbidden");
    });
  });
});
