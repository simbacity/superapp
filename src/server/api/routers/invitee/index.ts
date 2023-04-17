import {
  inviteeRequestSchema,
  inviteeSchema,
} from "@api-contracts/invitee.schema";
import InviteeEntity from "@business-logic/invitee.entity";
import { createTRPCRouter, publicProcedure } from "@server/api/trpc";

export const inviteeRouter = createTRPCRouter({
  create: publicProcedure
    .input(inviteeRequestSchema)
    .output(inviteeSchema)
    .mutation(async ({ input }) => {
      const entity = new InviteeEntity();

      return await entity.create(input);
    }),
});
