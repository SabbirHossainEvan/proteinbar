import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const customerSessionCookieName = "proteinbar_customer_session";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get(customerSessionCookieName)?.value;

  if (sessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("returnTo", `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/checkout",
    "/normal/:planId/checkout",
    "/custom/:planId/checkout",
    "/pages/monthly-plan/:planId/checkout",
  ],
};
