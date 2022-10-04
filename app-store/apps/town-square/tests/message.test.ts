import { MessageRequest, MessageResponse } from "@app-store/apps/town-square/api-contracts/message.schema";
import { MessageThreadResponse } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import prisma from "@app-store/shared/utils/prisma";
import { setup } from "@app-store/shared/utils/tests/setup";
import { teardown } from "@app-store/shared/utils/tests/teardown";

describe("Message", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#find", () => {
    it("finds message", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is content of the message",
      };

      const entity = new MessageEntity();
      const response = await entity.create(requestParams, user.id);

      const message = await entity.find(response.id, user.id);

      expect(message.content).toBe(requestParams.content);
    });
  });

  it("throws error when message is from different user", async () => {
    const { user } = await setup();

    const requestParams: MessageRequest = {
      content: "This is the content of the message",
    };

    const entity = new MessageEntity();
    const response = await entity.create(requestParams, user.id);

    await expect(async () => {
      await entity.find(response.id, "random_user");
    }).rejects.toThrowError("Forbidden");
  });

  describe("#create", () => {
    it("creates message", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const response = await entity.create(requestParams, user.id);

      const message = (await prisma.message_TownSquare.findUnique({
        where: { id: response?.id },
      })) as MessageResponse;

      expect(message.content).toBe(requestParams.content);
    });

    it("creates message in A new thread with messageId", async () => {
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

      const responseInThread = await entity.create(requestParamsWithMessageId, user.id);

      const message = (await prisma.message_TownSquare.findUnique({
        where: { id: responseInThread.id },
      })) as MessageResponse;
      const thread = (await prisma.messageThread_TownSquare.findUnique({
        where: { messageId: response.id },
      })) as MessageThreadResponse;

      expect(message.content).toBe(requestParamsWithMessageId.content);
      expect(response.id).toBe(thread?.messageId);
    });
  });

  describe("#list", () => {
    it("list messages", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const createFirstMessage = await entity.create(requestParams, user.id);
      const createSecondMessage = await entity.create(requestParams, user.id);
      const createThirdMessage = await entity.create(requestParams, user.id);
      await Promise.all([createFirstMessage, createSecondMessage, createThirdMessage]);

      const allMessages = await entity.list({ pageSize: "100" });

      expect(allMessages.length).toBe(3);
    });

    // Todo: load more messages using cursor
  });

  describe("#delete", () => {
    it("deletes if messages is from user", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const response = await entity.create(requestParams, user.id);

      await entity.delete(response.id, user.id);

      const message = await prisma.message_TownSquare.findUnique({ where: { id: response.id } });

      expect(message).toBe(null);
    });

    it("does not delete if post is from a different user", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();
      const response = await entity.create(requestParams, user.id);

      await expect(async () => {
        await entity.delete(response.id, "random_user");
      }).rejects.toThrowError("Forbidden");
    });
  });
});
