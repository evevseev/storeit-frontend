import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Only run ESLint during development, not during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only run type checking during development, not during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
