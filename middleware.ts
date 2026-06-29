import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware — NextAuth completely removed from edge runtime.
// Admin route guard is DISABLED until AUTH_SECRET is configured in Netlify.
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Client portal: must be logged in (check next-auth session cookie)
  if (pathname.startsWith("/client")) {
    const sessionCookie =
      req.cookies.get("__Secure-authjs.session-token")?.value ||
      req.cookies.get("authjs.session-token")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Forward pathname header for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/client/:path*"],
};
