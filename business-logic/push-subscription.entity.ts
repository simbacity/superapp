import { PushSubscriptionRequest, PushSubscriptionResponse } from "@api-contracts/push-subscription.schema";
import prisma from "@app-store/shared/utils/prisma";

export default class PushSubscriptionEntity {
  async create(params: PushSubscriptionRequest, userId: string) {
    const { subscriptionObject } = params;

    const pushSubscription: PushSubscriptionResponse = await prisma.pushSubscription.create({
      data: {
        userId,
        subscriptionObject,
      },
    });

    return pushSubscription;
  }

  async delete(id: string) {
    return prisma.pushSubscription.delete({ where: { id } });
  }
}
