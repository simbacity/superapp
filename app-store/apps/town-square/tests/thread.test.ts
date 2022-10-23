import { MessageRequest, Message } from "@app-store/apps/town-square/api-contracts/message.schema";
import { Thread } from "@app-store/apps/town-square/api-contracts/thread.schema";
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
      const response = await entity.create(requestParams, user.id);

      const requestParamsWithMessageId: MessageRequest = {
        content: "This is the comment of the message",
        messageId: response.id,
      };

      await entity.create(requestParamsWithMessageId, user.id);

      const thread = (await prisma.messageThread_TownSquare.findUnique({
        where: { messageId: response.id },
      })) as Thread;

      expect(response.id).toBe(thread?.messageId);
    });
  });

  describe("#delete", () => {
    it("deletes a thread when main message of thread is deleted", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const threadEntity = new ThreadEntity();
      const response = await entity.create(requestParams, user.id);

      const requestParamsWithMessageId: MessageRequest = {
        content: "This is the comment of the message",
        messageId: response.id,
      };

      const threadMessage: Message = await entity.create(requestParamsWithMessageId, user.id);

      await threadEntity.delete(threadMessage.threadId!);

      const thread = await prisma.messageThread_TownSquare.findUnique({ where: { messageId: response.id } });

      expect(thread).toBe(null);
    });
  });
});
