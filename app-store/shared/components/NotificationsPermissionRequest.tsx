import { PushSubscriptionRequest } from "@api-contracts/push-subscription.schema";
import axios from "axios";
import { useEffect, useState } from "react";

export default function NotificationsPermissionBox() {
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const isBrowser = typeof window !== "undefined" && "serviceWorker" in navigator && "workbox" in window;
    if (!isBrowser) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const expirationTime = subscription && (subscription as any)?.expirationTime;
        if (!(expirationTime && Date.now() > expirationTime - 5 * 60 * 1000)) {
          setSubscription(subscription);
        }
      });
      setRegistration(registration);
    });
  }, []);

  const onEnableNotificationsClick = async () => {
    if (!registration) return;
    setButtonIsLoading(true);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
    });

    const payload: PushSubscriptionRequest = { subscriptionObject: JSON.stringify(subscription) };
    await axios.post("/api/push-subscription/create", payload);

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
        className="primary-button--medium">
        Enable notifications
      </button>
    </div>
  );
}
