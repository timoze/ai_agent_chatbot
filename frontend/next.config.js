/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Configure environment variables
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    },
    // Suppress console messages in production
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
  }
  
  module.exports = nextConfig