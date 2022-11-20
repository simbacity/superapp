import { MessageRequest } from "@app-store/apps/town-square/api-contracts/message.schema";
import { ThreadResponse } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import ThreadEntity from "@app-store/apps/town-square/business-logic/thread.entity";
import prisma from "@app-store/shared/utils/prisma";
import { setup } from "@app-store/shared/utils/tests/setup";
import { teardown } from "@app-store/shared/utils/tests/teardown";

describe("Thread", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#create", () => {
    it("creates a thread", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const messageEntity = new MessageEntity();
      const threadEntity = new ThreadEntity();

      const messageResponse = await messageEntity.create(requestParams, user.id);
      const threadResponse = await threadEntity.create({ messageId: messageResponse.id });

      const thread = (await prisma.thread_TownSquare.findUnique({
        where: { id: threadResponse.id },
      })) as ThreadResponse;

      expect(thread?.messageId).toBe(messageResponse.id);
    });
  });

  describe("#delete", () => {
    it("deletes thread if thread's main message is from user", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const messageEntity = new MessageEntity();
      const threadEntity = new ThreadEntity();

      const messageResponse = await messageEntity.create(requestParams, user.id);
      const threadResponse = await threadEntity.create({ messageId: messageResponse.id });

      await threadEntity.delete(threadResponse.id, user.id);
      const thread = await prisma.thread_TownSquare.findUnique({
        where: { messageId: messageResponse.id },
      });

      expect(thread).toBe(null);
    });

    it("does not delete thread if thread's main message is from a different user", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const messageEntity = new MessageEntity();
      const threadEntity = new ThreadEntity();

      const messageResponse = await messageEntity.create(requestParams, user.id);
      const threadResponse = await threadEntity.create({ messageId: messageResponse.id });

      await expect(async () => {
        await threadEntity.delete(threadResponse.id, "random_user");
      }).rejects.toThrowError("Forbidden");
    });
  });
});
