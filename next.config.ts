import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Electron file:// compatibility
  trailingSlash: true,
  // Disable X-Powered-By header for security
  poweredByHeader: false,
};

export default nextConfig;
