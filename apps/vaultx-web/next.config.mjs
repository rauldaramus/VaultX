/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // The 'unoptimized' setting is used for image handling in the next-lite environment.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
