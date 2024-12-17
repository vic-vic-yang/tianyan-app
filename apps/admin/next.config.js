/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
