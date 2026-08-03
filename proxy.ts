import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const customerSessionCookieName = "proteinbar_customer_session";

function isProtectedCheckoutPath(pathname: string) {
  return (
    pathname === "/checkout" ||
    /^\/(?:normal|custom)\/[^/]+\/checkout$/.test(pathname) ||
    /^\/pages\/monthly-plan\/[^/]+\/checkout$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  // ============================
  // MealPrep domain handling
  // ============================

  // Redirect:
  // proteinbargroup.com/mealprep/*
  //        ↓
  // mealprep.proteinbargroup.com/*
  if (host === "proteinbargroup.com" && pathname.startsWith("/mealprep")) {
    const url = request.nextUrl.clone();

    url.hostname = "mealprep.proteinbargroup.com";
    url.pathname = pathname.replace("/mealprep", "") || "/";

    return NextResponse.redirect(url, 308);
  }

  // Rewrite:
  // mealprep.proteinbargroup.com/*
  //        ↓
  // /mealprep/*
  if (host === "mealprep.proteinbargroup.com") {
    const url = request.nextUrl.clone();

    url.pathname = `/mealprep${pathname}`;

    return NextResponse.rewrite(url);
  }

  // ============================
  // Existing checkout protection
  // ============================

  if (!isProtectedCheckoutPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(customerSessionCookieName)?.value;

  if (sessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set("returnTo", `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Run the proxy for all pages except internal assets.
     * This is needed because the host-based redirect/rewrite
     * must see every request.
     */
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
