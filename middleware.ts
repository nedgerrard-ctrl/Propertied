import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Use the edge-safe config (no bcrypt / mongoose) for the middleware runtime.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const userType = (req.auth?.user as { userType?: string } | undefined)?.userType;
  const pendingApproval = (req.auth?.user as { pendingApproval?: boolean } | undefined)?.pendingApproval;
  const pathname = req.nextUrl.pathname;

  // Admin route guard DISABLED — re-enable once auth is stable
  // if (pathname.startsWith("/admin") && (!isLoggedIn || role !== "admin")) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // Client portal: must be logged in
  if (pathname.startsWith("/client") && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Developer sub-pages: must be admin or developer-role client
  if (pathname.startsWith("/developer/")) {
    const isAdmin = role === "admin";
    const isDeveloper = role === "client" && userType === "developer";
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin && !isDeveloper) {
      return NextResponse.redirect(new URL("/developer", req.url));
    }
  }

  // VIP routes: extra guard — must be admin or approved existing client
  if (pathname.startsWith("/client/vip")) {
    const isAdmin = role === "admin";
    const isApprovedExistingClient =
      role === "client" && userType === "existing_client" && !pendingApproval;
    if (!isAdmin && !isApprovedExistingClient) {
      return NextResponse.redirect(new URL("/client/dashboard", req.url));
    }
  }

  // Forward the pathname so server-component layouts can build callbackUrls
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/developer/:path+"],
};
