import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { sendEmail } from "@/lib/email";
import { buildVerificationCodeEmail } from "@/lib/email-templates";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    }

    const { email, firstName } = body;

    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { message: "Please correct the highlighted fields.", fieldErrors: { email: "Please enter a valid email address." } },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = (typeof firstName === "string" && firstName.trim()) ? firstName.trim() : "there";

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail }).select("_id").lean();
    if (existingUser) {
      return NextResponse.json(
        { message: "Please correct the highlighted fields.", fieldErrors: { email: "An account with this email already exists." } },
        { status: 409 }
      );
    }

    // Remove any existing code for this email
    await VerificationCode.deleteMany({ email: normalizedEmail });

    // Generate a secure 6-digit code
    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await VerificationCode.create({
      email: normalizedEmail,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const { subject, html, text } = buildVerificationCodeEmail({ firstName: displayName, code });
    await sendEmail({ to: normalizedEmail, subject, html, text });

    return NextResponse.json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
