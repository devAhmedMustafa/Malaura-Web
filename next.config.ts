import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5126',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5126',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5126',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '5126',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
