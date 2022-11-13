import { MessageRequest, MessageResponse } from "@app-store/apps/town-square/api-contracts/message.schema";
import { ThreadResponse } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import ThreadEntity from "@app-store/apps/town-square/business-logic/thread.entity";
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

      const message = await entity.find(response.id);

      expect(message?.content).toBe(requestParams.content);
    });
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

    it("creates message in a new thread", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const messageEntity = new MessageEntity();
      const threadEntity = new ThreadEntity();

      const messageResponse = await messageEntity.create(requestParams, user.id);
      const threadResponse = await threadEntity.create({ messageId: messageResponse.id });

      const requestParamsWithMessageId: MessageRequest = {
        content: "This is the comment of the message",
        threadId: threadResponse.id,
      };

      const responseInThread = await messageEntity.create(requestParamsWithMessageId, user.id);

      const message = (await prisma.message_TownSquare.findUnique({
        where: { id: responseInThread.id },
      })) as MessageResponse;

      const thread = (await prisma.messageThread_TownSquare.findUnique({
        where: { messageId: messageResponse.id },
      })) as ThreadResponse;

      expect(message.content).toBe(requestParamsWithMessageId.content);
      expect(messageResponse.id).toBe(thread?.messageId);
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

    it("list more messages after the first fetch", async () => {
      const { user } = await setup();

      const requestParams: MessageRequest = {
        content: "This is the content of the message",
      };

      const entity = new MessageEntity();

      const createFirstMessage = await entity.create(requestParams, user.id);
      const createSecondMessage = await entity.create(requestParams, user.id);
      const createThirdMessage = await entity.create(requestParams, user.id);
      await Promise.all([createFirstMessage, createSecondMessage, createThirdMessage]);

      const messagesLoadedOnInitialRequest = await entity.list({ pageSize: "2" });
      const messagesLoadedOnLoadMore = await entity.list({
        pageSize: "2",
        cursor: messagesLoadedOnInitialRequest[1].id,
      });

      expect(messagesLoadedOnInitialRequest.length).toBe(2);
      expect(messagesLoadedOnLoadMore.length).toBe(1);
    });
  });

  describe("#delete", () => {
    it("deletes message if message is from user", async () => {
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

    it("does not delete message if message is from a different user", async () => {
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
