import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isLoginPage && isLoggedIn && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (isAdminRoute && !isLoginPage && (!isLoggedIn || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};