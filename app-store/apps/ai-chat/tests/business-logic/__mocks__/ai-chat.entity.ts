import { AIChatRequest } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";

export const mockCreate = jest.fn((params: AIChatRequest) => {
  if (params.message && params.model) {
    return Promise.resolve({ message: "Response From AI" });
  }
});
export const mockListModels = jest.fn(() =>
  Promise.resolve([{ id: "davinci", object: "engine", ready: true }])
);

const mockAIChatEntity = jest.fn().mockImplementation(function () {
  return {
    create: mockCreate,
    listModels: mockListModels,
  };
});

export default mockAIChatEntity;
