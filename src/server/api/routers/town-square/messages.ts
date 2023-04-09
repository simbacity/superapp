import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  messageRequestSchema,
  messageDefaultSchema,
  messageListRequestSchema,
  messageListSchema,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";

export const messagesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(messageRequestSchema)
    .output(messageDefaultSchema)
    .mutation(async ({ ctx, input }) => {
      const entity = new MessageEntity();

      return await entity.create(input, ctx.session.user.id);
    }),
  list: protectedProcedure
    .input(messageListRequestSchema)
    .output(messageListSchema)
    .query(async ({ input }) => {
      const entity = new MessageEntity();

      return await entity.list(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(messageDefaultSchema)
    .mutation(async ({ input, ctx }) => {
      const entity = new MessageEntity();

      return await entity.delete(input.id, ctx.session.user.id);
    }),
});
