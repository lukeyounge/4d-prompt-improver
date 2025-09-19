/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  outputFileTracingRoot: __dirname
}

module.exports = nextConfig
