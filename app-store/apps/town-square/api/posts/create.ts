import { postCreateSchema } from "@app-store/apps/town-square/api-contracts/post.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import { router, publicProcedure } from "@app-store/shared/server/trpc";

export default router({
  create: publicProcedure.input(postCreateSchema).query(async ({ input }) => {
    return new MessageEntity().create(input, "123");
  }),
});
