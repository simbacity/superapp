/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    WEB_PUSH_VAPID_PUBLIC_KEY: process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
    SOCKET_IO_URL: process.env.SOCKET_IO_URL,
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  ...nextConfig,
});
