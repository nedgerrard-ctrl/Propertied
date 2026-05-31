import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json({ message: "Invalid verification link." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({
    email: email.toLowerCase(),
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Verification link is invalid or has expired." },
      { status: 400 }
    );
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return NextResponse.json({ message: "Email verified successfully." });
}
