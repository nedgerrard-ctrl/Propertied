import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["docusign-esign"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
