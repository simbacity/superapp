import {
  pushSubscriptionRequestSchema,
  pushSubscriptionSchema,
} from "@api-contracts/push-subscription.schema";
import PushSubscriptionEntity from "@business-logic/push-subscription.entity";
import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";

export const pushSubscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(pushSubscriptionRequestSchema)
    .output(pushSubscriptionSchema)
    .mutation(async ({ input, ctx }) => {
      const entity = new PushSubscriptionEntity();

      return await entity.create(input, ctx.session.user.id);
    }),
});
