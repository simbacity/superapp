import { AIChatRequest } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-XM2bRJrJqKqdLFlorXndytFY",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default class AIChatEntity {
  async create(params: AIChatRequest) {
    const { message } = params;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}`,
      max_tokens: 100,
      temperature: 0.5,
    });

    return { id: response.data.id, message: response.data.choices[0].text };
  }
}
