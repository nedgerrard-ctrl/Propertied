import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password =
    typeof body.password === "string" ? body.password : "";

  const fieldErrors: Record<string, string> = {};

  if (!email) {
    fieldErrors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    const user = await User.findOne({ email, isDeleted: { $ne: true } });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
          fieldErrors: { password: "Invalid email or password." },
        },
        { status: 401 }
      );
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);

    if (!passwordOk) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
          fieldErrors: { password: "Invalid email or password." },
        },
        { status: 401 }
      );
    }

    // Validation passed — NextAuth signIn will handle the actual session
    return NextResponse.json({ message: "Credentials valid." }, { status: 200 });
  } catch (error) {
    console.error("Login validation error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
