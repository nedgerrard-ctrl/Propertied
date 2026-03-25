import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { buildResetPasswordEmail } from "@/lib/email-templates";

const RESET_TOKEN_EXPIRY_MINUTES = 30;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    const genericResponse = {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };

    if (!user) {
      return NextResponse.json(genericResponse, { status: 200 });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * RESET_TOKEN_EXPIRY_MINUTES
    );

    user.resetPasswordTokenHash = hashedToken;
    user.resetPasswordExpiresAt = expiresAt;
    await user.save();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() || req.nextUrl.origin;

    const resetLink = `${appUrl}/reset-password?token=${rawToken}`;

    const emailContent = buildResetPasswordEmail({
      resetLink,
      expiryMinutes: RESET_TOKEN_EXPIRY_MINUTES,
    });

    try {
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (mailError) {
      console.error("Email send failed:", mailError);

      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json(
          {
            ...genericResponse,
            resetLink,
            warning:
              "Email sending is not configured, so the reset link is returned for development only.",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: "Unable to send reset email right now." },
        { status: 500 }
      );
    }

    return NextResponse.json(genericResponse, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        message:
          "Unable to send reset email right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}