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
  if (!isProtectedCheckoutPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(customerSessionCookieName)?.value;
  if (sessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "returnTo",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/checkout",
    "/normal/:path*",
    "/custom/:path*",
    "/pages/monthly-plan/:path*",
  ],
};
