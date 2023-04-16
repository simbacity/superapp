import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import ThreadEntity from "@app-store/apps/town-square/business-logic/thread.entity";
import {
  threadDefaultSchema,
  threadListSchema,
  threadRequestSchema,
  threadSchema,
} from "@app-store/apps/town-square/api-contracts/thread.schema";

export const threadsRouter = createTRPCRouter({
  show: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(threadSchema)
    .query(async ({ input }) => {
      const entity = new ThreadEntity();

      return await entity.find(input.id);
    }),
  list: protectedProcedure.output(threadListSchema).query(async () => {
    const entity = new ThreadEntity();

    return await entity.list();
  }),
  create: protectedProcedure
    .input(threadRequestSchema)
    .output(threadDefaultSchema)
    .mutation(async ({ input }) => {
      const entity = new ThreadEntity();
      return await entity.create(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(threadDefaultSchema)
    .mutation(async ({ input, ctx }) => {
      const entity = new ThreadEntity();

      return await entity.delete(input.id, ctx.session.user.id);
    }),
});
