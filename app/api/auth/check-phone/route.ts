import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!phone) {
    return NextResponse.json({ message: "Phone number is required." }, { status: 400 });
  }

  try {
    await connectDB();
    const existing = await User.findOne({ phone, isDeleted: { $ne: true } }).lean();

    if (existing) {
      return NextResponse.json(
        { message: "This phone number is already registered." },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Phone number is available." }, { status: 200 });
  } catch (error) {
    console.error("Check phone error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
