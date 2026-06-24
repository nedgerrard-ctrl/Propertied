import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { sendEmail } from "@/lib/email";
import { buildVerificationCodeEmail } from "@/lib/email-templates";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_EXPIRY_MINUTES = 15;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : "there";

  const fieldErrors: Record<string, string> = {};

  if (!email) {
    fieldErrors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    // Check if email is already registered
    const existingUser = await User.findOne({
      email,
      isDeleted: { $ne: true },
    }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
          fieldErrors: { email: "An account with this email already exists." },
        },
        { status: 409 }
      );
    }

    // Generate a 6-digit code
    const code = String(crypto.randomInt(100000, 999999));
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    // Upsert verification code (one per email)
    await VerificationCode.findOneAndUpdate(
      { email },
      { codeHash, expiresAt },
      { upsert: true, new: true }
    );

    // Send email
    const { subject, html, text } = buildVerificationCodeEmail({
      firstName,
      code,
    });

    await sendEmail({ to: email, subject, html, text });

    return NextResponse.json(
      { message: "Verification code sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { message: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
