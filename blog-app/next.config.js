/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all https domains (you might want to restrict this in production)
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
}

module.exports = nextConfig
