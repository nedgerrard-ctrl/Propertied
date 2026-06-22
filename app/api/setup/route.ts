import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isValidPassword } from "@/lib/password-validation";

// One-time admin setup endpoint.
// Only works when zero admin accounts exist in the database.
// Once an admin exists, this endpoint returns 403 and cannot be used again.

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      }, { status: 400 });
    }

    await connectDB();

    // Only allow creation if no admin exists yet
    const adminExists = await User.findOne({ role: "admin" }).lean();
    if (adminExists) {
      return NextResponse.json({ message: "Admin account already exists." }, { status: 403 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      name: "PPM Admin",
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "admin",
    });

    return NextResponse.json({ message: "Admin account created successfully." });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
