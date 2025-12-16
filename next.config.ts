import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "placehold.co",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "i.pravatar.cc",
      },
      {
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true,
  },
};

export default nextConfig;
