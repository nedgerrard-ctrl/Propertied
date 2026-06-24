import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isValidPassword } from "@/lib/password-validation";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const token =
    typeof body.token === "string" ? body.token.trim() : "";
  const password =
    typeof body.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json(
      { message: "Invalid or missing reset token." },
      { status: 400 }
    );
  }

  if (!password || !isValidPassword(password)) {
    return NextResponse.json(
      {
        message:
          "Password must be at least 8 characters with uppercase, lowercase, a number, and a special character.",
      },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    const tokenHash = sha256(token);

    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
      isDeleted: { $ne: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
    });

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
