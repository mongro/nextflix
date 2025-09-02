/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/browse",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
  reactStrictMode: true,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});
module.exports = withBundleAnalyzer(nextConfig);
