import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Allow importing MDX content from the content directory
  serverExternalPackages: ["gray-matter", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
