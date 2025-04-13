import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        'https://qzov64wd54av2cp1.public.blob.vercel-storage.com/recipes/**',
      ),
    ],
  },
};

export default nextConfig;
