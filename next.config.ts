import type { NextConfig } from "next";

const backendApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:5000/api/v1";
const primaryWebsiteHostnames = [
  "proteinbargroup.com",
  "www.proteinbargroup.com",
];
const mealPrepHostname = "mealprep.proteinbargroup.com";
const mealPrepFlowPaths = [
  "/normal/:planId/set-plan",
  "/normal/:planId/select-meals",
  "/normal/:planId/selected-meals",
  "/normal/:planId/checkout",
  "/custom/:planId/set-plan",
  "/custom/:planId/select-meals",
  "/custom/:planId/selected-meals",
  "/custom/:planId/checkout",
  "/custom/set-plan",
  "/payment/cmi-return",
];

function redirectMainWebsitePath(source: string, destination: string) {
  return primaryWebsiteHostnames.map((hostname) => ({
    source,
    has: [{ type: "host" as const, value: hostname }],
    destination,
    permanent: true,
  }));
}

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
  async redirects() {
    return [
      ...redirectMainWebsitePath(
        "/mealprep/:path*",
        `https://${mealPrepHostname}/:path*`,
      ),
      ...redirectMainWebsitePath(
        "/pages/monthly-plan",
        `https://${mealPrepHostname}`,
      ),
      ...redirectMainWebsitePath(
        "/pages/monthly-plan/:path+",
        `https://${mealPrepHostname}/pages/monthly-plan/:path+`,
      ),
      ...mealPrepFlowPaths.flatMap((path) =>
        redirectMainWebsitePath(path, `https://${mealPrepHostname}${path}`),
      ),
      {
        source: "/mealprep/:path*",
        has: [{ type: "host", value: mealPrepHostname }],
        destination: `https://${mealPrepHostname}/:path*`,
        permanent: true,
      },
      {
        source: "/mealprep/:path*",
        has: [{ type: "host", value: "mealprep.localhost" }],
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: mealPrepHostname }],
          destination: "/mealprep",
        },
        {
          source: "/",
          has: [{ type: "host", value: "mealprep.localhost" }],
          destination: "/mealprep",
        },
      ],
      afterFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${backendApiBaseUrl.replace(/\/$/, "")}/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
