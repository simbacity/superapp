import { MessageRequest } from "@app-store/apps/town-square/api-contracts/message.schema";
import { MessageThreadResponse } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
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
      })) as MessageThreadResponse;

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
      const response = await entity.create(requestParams, user.id);

      const requestParamsWithMessageId: MessageRequest = {
        content: "This is the comment of the message",
        messageId: response.id,
      };

      await entity.create(requestParamsWithMessageId, user.id);

      await entity.delete(response.id, user.id);

      const thread = await prisma.messageThread_TownSquare.findUnique({ where: { messageId: response.id } });

      expect(thread).toBe(null);
    });
  });
});
