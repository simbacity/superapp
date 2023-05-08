import { inviteeRouter } from "@server/api/routers/invitee";
import { createTRPCRouter } from "./trpc";
import { townSquareRouter } from "@server/api/routers/town-square";
import { pushSubscriptionRouter } from "@server/api/routers/push-subscription";

export const appRouter = createTRPCRouter({
  townSquare: townSquareRouter,
  invitee: inviteeRouter,
  pushSubscription: pushSubscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
