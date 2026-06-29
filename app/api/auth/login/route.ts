export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emergency hardcoded admin — works without any database
const HARDCODED_ADMIN = {
  email: "nedgerrard@gmail.com",
  passwordHash: "$2a$10$hardcoded", // placeholder — checked below by plain comparison
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email    = typeof body.email    === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: "Valid email required.", fieldErrors: { email: "Valid email required." } }, { status: 422 });
  }
  if (!password) {
    return NextResponse.json({ message: "Password required.", fieldErrors: { password: "Password required." } }, { status: 422 });
  }

  // Hardcoded admin bypass — no database needed
  if (email === "nedgerrard@gmail.com" && password === "PpmAdmin2026!") {
    return NextResponse.json({ message: "Credentials valid." }, { status: 200 });
  }

  // Normal MongoDB path for other users
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const User = (await import("@/models/User")).default;
    await connectDB();
    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password.", fieldErrors: { password: "Invalid email or password." } }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid email or password.", fieldErrors: { password: "Invalid email or password." } }, { status: 401 });
    }
    return NextResponse.json({ message: "Credentials valid." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
