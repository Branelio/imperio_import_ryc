import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd39ru7awumhhs2.cloudfront.net',
      },
    ],
  },
}

export default nextConfig
