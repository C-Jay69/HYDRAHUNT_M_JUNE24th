import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Prevent webpack from trying to bundle Node.js-only packages
  serverExternalPackages: [
    'bullmq',
    'ioredis',
    'puppeteer',
    'pdf-parse',
    'mammoth',
    '@google/genai',
  ],

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
