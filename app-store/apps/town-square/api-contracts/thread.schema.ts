import { messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { z } from "zod";

export const threadSchema = z
  .object({
    id: z.string(),
    messageId: z.string(),
    mainMessage: messageSchema,
    messages: z.array(messageSchema),
    createdAt: z.date().or(z.string()),
  })
  .nullable();

export type Thread = z.TypeOf<typeof threadSchema>;
