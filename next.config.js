/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
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
