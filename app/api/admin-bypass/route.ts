import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Visit /api/admin-bypass?key=ppm2026 to get instant admin access
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== "ppm2026") {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }
  const response = NextResponse.redirect(new URL("/admin/dashboard", req.url));
  response.cookies.set("ppm-admin-token", "ppm-authorized-2026", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
