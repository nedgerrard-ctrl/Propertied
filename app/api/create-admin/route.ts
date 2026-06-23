import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Pre-computed bcrypt hash of "C21MetroProjects!" (12 rounds) — avoids timeout on cold start
const PASSWORD_HASH = "$2b$12$DsxhyAiyajTr/le/fgVn1.PEpKnLLyU6dSoBslec76B6viadQgQle";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "ppm-setup-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email: "nedgerrard@gmail.com" });
    if (existing) {
      return NextResponse.json({ message: "Admin already exists", email: existing.email });
    }

    const user = await User.create({
      name: "PPM Admin",
      email: "nedgerrard@gmail.com",
      passwordHash: PASSWORD_HASH,
      role: "admin",
      accountStatus: "active",
      isDeleted: false,
    });

    return NextResponse.json({ message: "Admin created successfully", id: user._id.toString() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
