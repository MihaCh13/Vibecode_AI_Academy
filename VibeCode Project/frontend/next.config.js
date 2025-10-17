/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Disable static optimization for dynamic pages
  trailingSlash: false,
  // Disable static generation for pages with authentication
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Force all pages to be server-side rendered
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
