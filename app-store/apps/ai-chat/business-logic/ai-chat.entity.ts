import { AIChatRequest } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANISATION_NAME,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default class AIChatEntity {
  async create(params: AIChatRequest) {
    const { message, model } = params;

    const response = await openai.createCompletion({
      model: model || "",
      prompt: `
      I want you to reply to all my questions in markdown format, wrap code examples in <code></code>, start each new code line on a new line. 
      Q: ${message}.
      `,
      max_tokens: 500,
      temperature: 0.5,
      top_p: 1,
    });

    return { id: response.data.id, message: response.data.choices[0].text };
  }

  async listModels() {
    const response = await openai.listModels();

    const models = response.data.data.map((model) => ({
      id: model.id,
      object: model.object,
    }));

    return models;
  }
}
