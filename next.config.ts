import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["gray-matter", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
