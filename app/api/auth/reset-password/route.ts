import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

type FieldErrors = Record<string, string>;

function jsonError(
  message: string,
  fieldErrors: FieldErrors = {},
  status = 400
) {
  return NextResponse.json(
    {
      success: false,
      message,
      fieldErrors,
    },
    { status }
  );
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const confirmPassword =
      typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

    const fieldErrors: FieldErrors = {};

    if (!token) {
      fieldErrors.token = "Reset token is missing";
    }

    if (!password) {
      fieldErrors.password = "Enter a new password";
    } else if (password.length < 8) {
      fieldErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      fieldErrors.password = "Include at least 1 uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      fieldErrors.password = "Include at least 1 lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      fieldErrors.password = "Include at least 1 number";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      fieldErrors.password = "Include at least 1 special character";
    } else if (!isStrongPassword(password)) {
      fieldErrors.password =
        "Password must meet all password requirements";
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Confirm your new password";
    } else if (password && confirmPassword !== password) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return jsonError("Please correct the highlighted fields.", fieldErrors);
    }

    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordTokenHash: hashedToken,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return jsonError(
        "This reset link is invalid or has expired.",
        { token: "This reset link is invalid or has expired" },
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.passwordHash = hashedPassword;
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Your password has been reset successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while resetting your password.",
        fieldErrors: {},
      },
      { status: 500 }
    );
  }
}