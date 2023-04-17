import { type PushSubscriptionRequest } from "@api-contracts/push-subscription.schema";
import { useEffect, useState } from "react";
import { env } from "../../../env.mjs";
import { api } from "../../../utils/api";

export default function NotificationsPermissionBox() {
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const createSubscription = api.pushSubscription.create.useMutation();

  useEffect(() => {
    const isBrowser =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "workbox" in window;
    if (!isBrowser) return;

    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.getSubscription();
      })
      .then((subscription) => {
        const isSubscription =
          subscription &&
          typeof subscription === "object" &&
          "endpoint" in subscription;
        if (
          !(
            isSubscription &&
            subscription.expirationTime &&
            Date.now() > subscription.expirationTime - 5 * 60 * 1000
          )
        ) {
          setSubscription(subscription);
        }
        setRegistration(registration);
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEnableNotificationsClick = async () => {
    if (!registration) return;
    setButtonIsLoading(true);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY,
    });

    const payload: PushSubscriptionRequest = {
      subscriptionObject: JSON.stringify(subscription),
    };

    createSubscription.mutate(payload);

    setSubscription(subscription);
    setButtonIsLoading(false);
  };

  if (subscription) return null;

  return (
    <div className="border-t-2 border-b-2 border-gray-400 p-4">
      <h2 className="h2">Enable push notifications</h2>
      <button
        onClick={onEnableNotificationsClick}
        disabled={buttonIsLoading}
        className="primary-button--medium"
      >
        Enable notifications
      </button>
    </div>
  );
}
