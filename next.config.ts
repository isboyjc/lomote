import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public-cdn.bblmw.cn'
      }
    ]
  }
}

export default nextConfig
