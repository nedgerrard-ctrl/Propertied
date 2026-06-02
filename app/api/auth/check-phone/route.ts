import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ available: true });
    }

    const { phone } = body;

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ available: true });
    }

    const trimmed = phone.trim();

    await connectDB();

    const existing = await User.findOne({ phone: trimmed }).select("_id").lean();
    if (existing) {
      return NextResponse.json(
        { available: false, message: "This phone number is already registered." },
        { status: 409 }
      );
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Check phone error:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
