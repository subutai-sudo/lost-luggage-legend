/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  env: {
    AFFILIATE_NETWORK: process.env.AFFILIATE_NETWORK || 'shareasale',
    AFFILIATE_MERCHANT_ID: process.env.AFFILIATE_MERCHANT_ID || '',
  },
}
module.exports = nextConfig
