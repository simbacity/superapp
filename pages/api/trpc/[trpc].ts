import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create();
// Base router and procedure helpers
const router = t.router;
const procedure = t.procedure;

const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
