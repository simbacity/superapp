import { createTRPCRouter } from "./trpc";
import { townSquareRouter } from "@server/api/routers/town-square";

export const appRouter = createTRPCRouter({
  townSquare: townSquareRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
