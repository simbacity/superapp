import prisma from "@app-store/shared/utils/prisma";
import PushSubscriptionEntity from "@business-logic/push-subscription.entity";
import webPush from "web-push";

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.WEB_PUSH_VAPID_PUBLIC_KEY || "",
  process.env.WEB_PUSH_VAPID_PRIVATE_KEY || ""
);

export default class PushNotificationEntity {
  async send(userIds: string[], title: string, message: string) {
    const pushSubscriptions = await this.findPushSubscriptionsByUserIds(userIds);
    const pushSubscriptionEntity = new PushSubscriptionEntity();

    for (const pushSubscription of pushSubscriptions) {
      try {
        await this.sendNotification(pushSubscription.subscriptionObject, title, message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const goneStatusCode = 410;
        const notFoundStatusCode = 404;
        if ([goneStatusCode, notFoundStatusCode].includes(error.statusCode)) {
          await pushSubscriptionEntity.delete(pushSubscription.id);
        } else {
          throw error;
        }
      }
    }
  }

  private async sendNotification(subscription: string, title: string, message: string) {
    return webPush.sendNotification(JSON.parse(subscription), JSON.stringify({ title, message }));
  }

  private async findPushSubscriptionsByUserIds(userIds: string[]) {
    return prisma.pushSubscription.findMany({
      where: {
        userId: { in: userIds },
      },
    });
  }
}
