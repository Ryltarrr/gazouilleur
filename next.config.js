const withPwa = require("next-pwa");
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com", "lh3.googleusercontent.com"],
  },
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
  i18n,
};

module.exports = withPwa(nextConfig);
