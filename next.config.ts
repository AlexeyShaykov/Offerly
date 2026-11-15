import { resolve } from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray lockfile in a parent directory made Next infer the wrong workspace root.
  outputFileTracingRoot: resolve(import.meta.dirname),
  // E2E runs its own dev server in a separate directory so it never clashes with `pnpm dev`.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default nextConfig;
