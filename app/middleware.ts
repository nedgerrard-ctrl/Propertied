import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const userType = (req.auth?.user as { userType?: string } | undefined)?.userType;
  const pendingApproval = (req.auth?.user as { pendingApproval?: boolean } | undefined)?.pendingApproval;
  const pathname = req.nextUrl.pathname;

  // Admin routes: must be admin
  if (pathname.startsWith("/admin") && (!isLoggedIn || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Client and developer portals: must be logged in (layout handles role check)
  if (pathname.startsWith("/client") || pathname.startsWith("/developer")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // VIP routes: extra guard — must be admin or approved existing client
  if (pathname.startsWith("/client/vip")) {
    const isAdmin = role === "admin";
    const isApprovedExistingClient =
      role === "client" &&
      userType === "existing_client" &&
      !pendingApproval;
    if (!isAdmin && !isApprovedExistingClient) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/developer/:path*"],
};