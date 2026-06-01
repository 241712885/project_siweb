import type { NextConfig } from 'next';

const nextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],
  experimental: {
    // paksa pakai Node.js runtime, bukan edge
  }
};

export default nextConfig;