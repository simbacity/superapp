import { postListSchema } from "@app-store/apps/town-square/api-contracts/post.schema";
import MessageEntity from "@app-store/apps/town-square/business-logic/message.entity";
import { router, publicProcedure } from "@app-store/shared/server/trpc";
import HttpError from "@app-store/shared/utils/errors/HttpError";
import { TRPCError } from "@trpc/server";

export default router({
  list: protectedProcedure
    .use({ ctx })
    .input(postListSchema)
    .query(async ({ input }) => {
      // where do we get the session from?
      // const session = await getSession({ req });
      // if (!ctx.session?.user?.id) return res.status(401).json("Not authenticated");
      return new MessageEntity().list(input);

      // check the error handling here and change it in our original endpoints
      // https://trpc.io/docs/server-side-calls#example-for-a-nextjs-api-endpoint
    }),
});
