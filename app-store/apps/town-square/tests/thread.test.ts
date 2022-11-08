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
    it("creates thread", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const threadEntity = new ThreadEntity();
      const response = await entity.create(requestParams, user.id);

      const threadResponse = await threadEntity.create({ messageId: response.id });

      const thread: ThreadResponse = await prisma.messageThread_TownSquare.findUnique({
        where: { id: threadResponse.id },
      });

      expect(thread?.messageId).toBe(response.id);
    });
  });

  describe("#delete", () => {
    it("deletes a thread", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const threadEntity = new ThreadEntity();
      const response = await entity.create(requestParams, user.id);

      const threadResponse = await threadEntity.create({ messageId: response.id });

      await threadEntity.delete(threadResponse.id);

      const thread = await prisma.messageThread_TownSquare.findUnique({ where: { messageId: response.id } });

      expect(thread).toBe(null);
    });
  });
});
