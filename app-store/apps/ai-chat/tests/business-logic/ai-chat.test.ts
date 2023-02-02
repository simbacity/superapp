import { AIChatRequest } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";

import MockAIChatEntity from "./__mocks__/ai-chat.entity";

jest.mock("./__mocks__/ai-chat.entity");

describe("AI-Chat", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe("#create", () => {
    it("creates post", async () => {
      const requestParams: AIChatRequest = {
        message: "Hello AI",
        model: "text-davinci-003",
      };

      const entity = new MockAIChatEntity();
      const result = await entity.create(requestParams);

      expect(MockAIChatEntity).toHaveBeenCalledTimes(1);
      expect(entity.create).toHaveBeenCalledWith(requestParams);
      expect(result?.message).toBe("Response From AI");
    });
  });

  describe("#lists", () => {
    it("lists models", async () => {
      const entitiy = new MockAIChatEntity();
      const result = await entitiy.listModels();

      expect(MockAIChatEntity).toHaveBeenCalledTimes(1);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
