/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: "out",
  images: {
    domains: [
      "localhost",
      "localhost:5000", // Replace with your backend domain
      "lh3.googleusercontent.com",
      "flagcdn.com",
    ],
  },
  i18n,
};

module.exports = nextConfig;
