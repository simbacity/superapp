import { UserSettingsRequest } from "@app-store/apps/subscriptions/api-contracts/usersettings.schema";
import ForbiddenError from "@app-store/shared/utils/errors/ForbiddenError";
import prisma from "@app-store/shared/utils/prisma";

export default class PostEntity {
  async find(userId: string) {
    const userSettings = await prisma.subscriptions_User_Settings.findUnique({ where: { userId } });

    return userSettings;
  }

  async createOrUpdate(params: UserSettingsRequest, userId: string) {
    const { displayName, welcomeMessage, name, surname, phone } = params;

    const response = await prisma.subscriptions_User_Settings.upsert({
      where: { userId },
      update: {
        displayName,
        welcomeMessage,
        name,
        surname,
        phone,
      },
      create: {
        displayName,
        welcomeMessage,
        name,
        surname,
        phone,
        userId,
      },
    });

    return response;
  }

  async delete(id: string, userId: string) {
    const post = await this.find(userId);

    if (post?.userId !== userId) {
      throw new ForbiddenError("Forbidden");
    }

    return prisma.subscriptions_User_Settings.delete({ where: { id } });
  }
}
