/**
 * ONE-TIME admin password reset endpoint.
 * DELETE THIS FILE once you have successfully logged in.
 *
 * POST /api/admin/reset-admin-password
 * Body: { "resetKey": "ppm-admin-reset-2026", "email": "your@email.com", "newPassword": "YourNewPassword1!" }
 *
 * The resetKey is a hard-coded one-time secret. Change or delete this file after use.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const RESET_KEY = "ppm-admin-reset-2026";

export async function POST(req: NextRequest) {
  let body: { resetKey?: string; email?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { resetKey, email, newPassword } = body;

  if (!resetKey || resetKey !== RESET_KEY) {
    return NextResponse.json({ error: "Invalid reset key." }, { status: 403 });
  }

  if (!email || !newPassword) {
    return NextResponse.json({ error: "email and newPassword are required." }, { status: 400 });
  }

  // Basic password rules (must match app validation)
  if (
    newPassword.length < 8 ||
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[^A-Za-z0-9]/.test(newPassword)
  ) {
    return NextResponse.json(
      { error: "Password must be 8+ chars with uppercase, lowercase, number, and special character." },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email: email.trim().toLowerCase(), role: "admin" });
  if (!user) {
    // Also try creating a new admin if none exists with this email
    const anyAdmin = await User.findOne({ role: "admin" });
    if (!anyAdmin) {
      // No admin exists at all — create one
      const hash = await bcrypt.hash(newPassword, 10);
      await User.create({
        name: "PPM Admin",
        email: email.trim().toLowerCase(),
        passwordHash: hash,
        role: "admin",
        emailVerified: true,
        accountStatus: "active",
      });
      return NextResponse.json({ ok: true, message: "Admin account created." });
    }
    return NextResponse.json({ error: "No admin found with that email." }, { status: 404 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, { passwordHash: hash });

  return NextResponse.json({ ok: true, message: "Admin password updated. Delete this endpoint now." });
}
