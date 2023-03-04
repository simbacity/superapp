import InviteeEntity from "@business-logic/invitee.entity";
import { prisma } from "@server/db";
import { TRPCError } from "@trpc/server";

export default class DummyUserEntity {
  async create(email: string) {
    const nameLowercase = email.split("@")[0];

    if (!nameLowercase) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid email.",
      });
    }

    const name = nameLowercase.charAt(0).toUpperCase() + nameLowercase.slice(1);

    await new InviteeEntity().createInvitee(email);

    const createDummyUser = await prisma.user.create({
      data: {
        email,
        name,
        image: `https://avatars.dicebear.com/api/avataaars/${nameLowercase}.svg`,
      },
    });

    return createDummyUser;
  }
}
