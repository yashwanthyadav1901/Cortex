import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so stray lockfiles in parent dirs don't confuse Turbopack.
  turbopack: { root: __dirname },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
