import { PostRequest } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import PostEntity from "@app-store/apps/mini-blog/business-logic/post.entity";
import prisma from "@app-store/shared/utils/prisma";
import { setup } from "@app-store/shared/utils/tests/setup";
import { teardown } from "@app-store/shared/utils/tests/teardown";
import { Post_MiniBlog } from "@prisma/client";

describe("Post", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#find", () => {
    it("finds post", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "This is the title of the post",
        content: "This is the content of the post",
      };

      const entity = new PostEntity();
      const result = await entity.create(requestParams, user.id);

      const post = await entity.find(result.id, user.id);

      expect(post.title).toBe(requestParams.title);
      expect(post.content).toBe(requestParams.content);
    });
  });

  it("throws error if post is from different user", async () => {
    const { user } = await setup();

    const requestParams: PostRequest = {
      title: "This is the title of the post",
      content: "This is the content of the post",
    };

    const entity = new PostEntity();
    const result = await entity.create(requestParams, user.id);

    await expect(async () => {
      await entity.find(result.id, "random_user_id");
    }).rejects.toThrowError("Forbidden");
  });

  describe("#create", () => {
    it("creates post", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "This is the title of the post",
        content: "This is the content of the post",
      };

      const entity = new PostEntity();
      const result = await entity.create(requestParams, user.id);

      const post = (await prisma.post_MiniBlog.findUnique({ where: { id: result?.id } })) as Post_MiniBlog;

      expect(post.title).toBe(requestParams.title);
      expect(post.content).toBe(requestParams.content);
    });
  });

  describe("#list", () => {
    it("lists posts", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "Random title",
        content: "Random content",
      };

      const entity = new PostEntity();
      const createFirstPost = entity.create(requestParams, user.id);
      const createSecondPost = entity.create(requestParams, user.id);
      const createThirdPost = entity.create(requestParams, user.id);
      await Promise.all([createFirstPost, createSecondPost, createThirdPost]);

      const allPosts = await entity.list(user.id);

      expect(allPosts.length).toBe(3);
    });
  });

  describe("#update", () => {
    it("updates post if post is from user", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "Random title",
        content: "Random content",
      };

      const entity = new PostEntity();
      const post = await entity.create(requestParams, user.id);

      const newParams: PostRequest = {
        title: "New title",
        content: "New content",
      };
      await entity.update(newParams, post.id, user.id);

      const result = await prisma.post_MiniBlog.findUnique({ where: { id: post.id } });

      expect(result?.title).toBe(newParams.title);
      expect(result?.content).toBe(newParams.content);
    });

    it("does not update post if post is from different user", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "Random title",
        content: "Random content",
      };

      const entity = new PostEntity();
      const post = await entity.create(requestParams, user.id);

      const newParams: PostRequest = {
        title: "New title",
        content: "New content",
      };

      await expect(async () => {
        await entity.update(newParams, post.id, "random_user_id");
      }).rejects.toThrowError("Forbidden");
    });
  });

  describe("#delete", () => {
    it("deletes post if post is from user", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "Random title",
        content: "Random content",
      };

      const entity = new PostEntity();
      const post = await entity.create(requestParams, user.id);

      await entity.delete(post.id, user.id);

      const result = await prisma.post_MiniBlog.findUnique({ where: { id: post.id } });

      expect(result).toBe(null);
    });

    it("does not delete post if post is from different user", async () => {
      const { user } = await setup();

      const requestParams: PostRequest = {
        title: "Random title",
        content: "Random content",
      };

      const entity = new PostEntity();
      const post = await entity.create(requestParams, user.id);

      await expect(async () => {
        await entity.delete(post.id, "random_user_id");
      }).rejects.toThrowError("Forbidden");
    });
  });
});
