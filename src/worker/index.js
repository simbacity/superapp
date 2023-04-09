// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use strict";

// Build and start PWA with service worker (dev mode doesn't work):
// npm run build
// npm run start

// Basic example for Next-PWA:
// https://github.com/shadowwalker/next-pwa/tree/master/examples/web-push

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("push", showNotification);

function showNotification(event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icon-192x192.png",
      vibrate: [
        500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110,
        170, 40, 500,
      ],
      data: { url: data.url },
    })
  );
}

self.addEventListener("notificationclick", clickNotification);

function clickNotification(event) {
  const notification = event.notification;
  notification.close();
  let clientWindowToOpen;

  if (notification.data.url) {
    event.waitUntil(
      (async () => {
        const allWindowClientsArray = await clients.matchAll({
          type: "window",
        });

        for (const windowClient of allWindowClientsArray) {
          if (windowClient.url === notification.data.url) {
            // window tab that matches the notification url already exists
            clientWindowToOpen = windowClient;
            windowClient.focus();
            break;
          }
        }

        if (!clientWindowToOpen) {
          // not existing tab matches notification url, we open a new tab
          clientWindowToOpen = await clients.openWindow(notification.data.url);
          clientWindowToOpen.focus();
        }
      })()
    );
  }
}
