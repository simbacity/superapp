import prisma from "@app-store/shared/utils/prisma";

export async function teardown() {
  return Promise.all([
    prisma.user.deleteMany({}),
    prisma.inviteCode.deleteMany({}),
    prisma.invitee.deleteMany({}),
    prisma.thread_TownSquare.deleteMany({}),
    prisma.message_TownSquare.deleteMany({}),
    prisma.subscriptions_Post.deleteMany({}),
    prisma.subscriptions_User_Settings.deleteMany({}),
  ]);
}
