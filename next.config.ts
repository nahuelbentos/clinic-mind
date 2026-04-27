import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["gray-matter", "@prisma/adapter-pg", "pg"],
};

export default withNextIntl(nextConfig);
