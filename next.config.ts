import type { NextConfig } from "next";

const backendApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendApiBaseUrl.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
