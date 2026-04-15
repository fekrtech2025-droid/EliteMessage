import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(process.cwd(), '../..'),
  transpilePackages: ['@elite-message/ui'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
