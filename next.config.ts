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
const mainWebsiteOnlyPaths = [
  { source: "/about-us", destination: "/about-us" },
  { source: "/contact", destination: "/contact" },
  { source: "/locations", destination: "/locations" },
  { source: "/menu", destination: "/menu" },
  { source: "/pages/about-us", destination: "/about-us" },
  { source: "/pages/contact", destination: "/contact" },
  { source: "/pages/locations", destination: "/locations" },
  { source: "/pages/menu", destination: "/menu" },
  { source: "/pages/nos-restaurants", destination: "/pages/nos-restaurants" },
  {
    source: "/pages/privacy-policy",
    destination: "/pages/privacy-policy",
  },
  {
    source: "/pages/terms-and-conditions",
    destination: "/pages/terms-and-conditions",
  },
  { source: "/cart", destination: "/cart" },
  { source: "/checkout", destination: "/checkout" },
  { source: "/collections/:path*", destination: "/collections/:path*" },
  { source: "/plans", destination: "/plans" },
  { source: "/products/:path*", destination: "/products/:path*" },
  { source: "/search", destination: "/search" },
];

function redirectMainWebsitePath(source: string, destination: string) {
  return primaryWebsiteHostnames.map((hostname) => ({
    source,
    has: [{ type: "host" as const, value: hostname }],
    destination,
    permanent: true,
  }));
}

function redirectMealPrepWebsitePath(source: string, destination: string) {
  return {
    source,
    has: [{ type: "host" as const, value: mealPrepHostname }],
    destination: `https://${primaryWebsiteHostnames[0]}${destination}`,
    permanent: true,
  };
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
      ...mainWebsiteOnlyPaths.map(({ source, destination }) =>
        redirectMealPrepWebsitePath(source, destination),
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
