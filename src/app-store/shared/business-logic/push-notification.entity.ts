import { prisma } from "@server/db";
import PushSubscriptionEntity from "@business-logic/push-subscription.entity";
import webPush from "web-push";

interface NotificationError {
  statusCode: number;
}

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL || ""}`,
  process.env.WEB_PUSH_VAPID_PUBLIC_KEY || "",
  process.env.WEB_PUSH_VAPID_PRIVATE_KEY || ""
);

export default class PushNotificationEntity {
  async send(userIds: string[], title: string, message: string, url: string) {
    const pushSubscriptions = await this.findPushSubscriptionsByUserIds(
      userIds
    );
    const pushSubscriptionEntity = new PushSubscriptionEntity();

    for (const pushSubscription of pushSubscriptions) {
      try {
        await this.sendNotification(
          pushSubscription.subscriptionObject,
          title,
          message,
          url
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error) {
        const goneStatusCode = 410;
        const notFoundStatusCode = 404;
        if (
          [goneStatusCode, notFoundStatusCode].includes(
            (error as NotificationError).statusCode
          )
        ) {
          await pushSubscriptionEntity.delete(pushSubscription.id);
        } else {
          throw error;
        }
      }
    }
  }

  private async sendNotification(
    subscription: string,
    title: string,
    message: string,
    url: string
  ) {
    return webPush.sendNotification(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      JSON.parse(subscription),
      JSON.stringify({ title, message, url })
    );
  }

  private async findPushSubscriptionsByUserIds(userIds: string[]) {
    return prisma.pushSubscription.findMany({
      where: {
        userId: { in: userIds },
      },
    });
  }
}
