import type { NextConfig } from "next";
import { execSync } from "child_process";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Compute build version from git at build time
function gitInfo() {
  try {
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
    const commitSha = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    return { commitCount, commitSha };
  } catch {
    return { commitCount: '0', commitSha: 'unknown' };
  }
}

const { commitCount, commitSha } = gitInfo();

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
  // Inject git build info as public env vars
  env: {
    NEXT_PUBLIC_BUILD_NUMBER: commitCount,
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
};

export default withBundleAnalyzer(nextConfig);
