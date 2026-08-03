import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const customerSessionCookieName = "proteinbar_customer_session";
const primaryWebsiteHostname = "proteinbargroup.com";
const primaryWebsiteHostnames = new Set([
  primaryWebsiteHostname,
  `www.${primaryWebsiteHostname}`,
]);
const mealPrepHostname = `mealprep.${primaryWebsiteHostname}`;

function getRequestHostname(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  const host = forwardedHost || request.headers.get("host") || "";

  return host.trim().toLowerCase().replace(/:\d+$/, "");
}

function isMealPrepHost(hostname: string) {
  return hostname === mealPrepHostname || hostname === "mealprep.localhost";
}

function isMealPrepFlowPath(pathname: string) {
  return (
    /^\/(?:normal|custom)\/[^/]+\/(?:set-plan|select-meals|selected-meals|checkout)\/?$/.test(
      pathname,
    ) ||
    pathname === "/custom/set-plan" ||
    pathname === "/pages/monthly-plan" ||
    pathname.startsWith("/pages/monthly-plan/") ||
    pathname === "/payment/cmi-return"
  );
}

function isMealPrepSupportPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    /\/[^/]+\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

function redirectToProductionHost(
  request: NextRequest,
  hostname: string,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = hostname;
  url.port = "";
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

function isProtectedCheckoutPath(pathname: string) {
  return (
    pathname === "/checkout" ||
    /^\/(?:normal|custom)\/[^/]+\/checkout$/.test(pathname) ||
    /^\/pages\/monthly-plan\/[^/]+\/checkout$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const hostname = getRequestHostname(request);
  const pathname = request.nextUrl.pathname;
  const onPrimaryWebsite = primaryWebsiteHostnames.has(hostname);
  const onMealPrepWebsite = isMealPrepHost(hostname);

  // Keep the old public URL working, but make the subdomain canonical.
  if (onPrimaryWebsite && (pathname === "/mealprep" || pathname.startsWith("/mealprep/"))) {
    const mealPrepPath = pathname.slice("/mealprep".length) || "/";
    return redirectToProductionHost(request, mealPrepHostname, mealPrepPath);
  }

  // Keep every existing meal-plan step on the Meal Prep subdomain.
  if (onPrimaryWebsite && isMealPrepFlowPath(pathname)) {
    const mealPrepPath = pathname === "/pages/monthly-plan" ? "/" : pathname;
    return redirectToProductionHost(request, mealPrepHostname, mealPrepPath);
  }

  if (onMealPrepWebsite) {
    // Avoid exposing the implementation path on the Meal Prep hostname.
    if (pathname === "/mealprep" || pathname.startsWith("/mealprep/")) {
      const publicPath = pathname.slice("/mealprep".length) || "/";
      if (hostname === mealPrepHostname) {
        return redirectToProductionHost(request, mealPrepHostname, publicPath);
      }

      const url = request.nextUrl.clone();
      url.pathname = publicPath;
      return NextResponse.redirect(url, 308);
    }

    // The clean subdomain root serves the existing /mealprep page internally.
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/mealprep";
      return NextResponse.rewrite(url);
    }

    // Meal-plan routes already exist at these paths, so do not prefix them.
    if (
      !isMealPrepFlowPath(pathname) &&
      !isMealPrepSupportPath(pathname)
    ) {
      if (hostname === mealPrepHostname) {
        return redirectToProductionHost(request, primaryWebsiteHostname, pathname);
      }

      return NextResponse.next();
    }
  }

  if (!isProtectedCheckoutPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(customerSessionCookieName)?.value;

  if (sessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  if (primaryWebsiteHostnames.has(hostname) || hostname === mealPrepHostname) {
    loginUrl.protocol = "https:";
    loginUrl.hostname = hostname;
    loginUrl.port = "";
  }
  loginUrl.searchParams.set("returnTo", `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
