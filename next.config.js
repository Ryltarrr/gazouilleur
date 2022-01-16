const withPwa = require("next-pwa");

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
};

module.exports = withPwa(nextConfig);
