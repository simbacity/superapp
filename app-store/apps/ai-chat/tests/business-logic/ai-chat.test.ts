import { AIChatRequest } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import AIChatEntity from "@app-store/apps/ai-chat/business-logic/ai-chat.entity";
import { teardown } from "@app-store/shared/utils/tests/teardown";

describe("Post", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#create", () => {
    it("creates post", async () => {
      const requestParams: AIChatRequest = {
        message: "Hello AI",
        model: "text-davinci-003",
      };

      const entity = new AIChatEntity();
      const result = await entity.create(requestParams);

      expect(result.message?.length).toBeGreaterThan(1);
    });
  });

  describe("#lists", () => {
    it("lists models", async () => {
      const entity = new AIChatEntity();

      const result = await entity.listModels();

      expect(result.length).toBeGreaterThan(1);
    });
  });
});
