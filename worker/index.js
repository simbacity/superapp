"use strict";

// Build and start PWA with service worker (dev mode doesn't work):
// yarn build
// yarn start

// Basic example for Next-PWA:
// https://github.com/shadowwalker/next-pwa/tree/master/examples/web-push

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("push", pushEvent);

function pushEvent(event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icon-192x192.png",
    })
  );
}
