import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token")?.trim() ?? "";
  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";

  if (!token || !email) {
    return NextResponse.json(
      { message: "Invalid verification link." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const user = await User.findOne({
      email,
      emailVerificationToken: token,
      isDeleted: { $ne: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "This verification link is invalid or has already been used." },
        { status: 400 }
      );
    }

    const expires = user.emailVerificationExpires;
    if (expires && expires < new Date()) {
      return NextResponse.json(
        { message: "This verification link has expired. Please sign up again." },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    return NextResponse.json(
      { message: "Email verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { message: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
