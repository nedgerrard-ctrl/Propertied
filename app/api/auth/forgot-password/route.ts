import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { buildResetPasswordEmail } from "@/lib/email-templates";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_EXPIRY_MINUTES = 60;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  // Always respond the same way to prevent email enumeration
  const successResponse = NextResponse.json(
    {
      message:
        "If an account exists for that email, a reset link has been sent.",
    },
    { status: 200 }
  );

  try {
    await connectDB();

    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!user) return successResponse;

    // Generate a secure random token — store SHA-256 so it's queryable
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://propertied.netlify.app";
    const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const { subject, html, text } = buildResetPasswordEmail({
      resetLink,
      expiryMinutes: RESET_EXPIRY_MINUTES,
    });

    await sendEmail({ to: email, subject, html, text });

    // In development expose the link for testing
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          message:
            "If an account exists for that email, a reset link has been sent.",
          resetLink,
        },
        { status: 200 }
      );
    }

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return successResponse; // Don't leak errors
  }
}
