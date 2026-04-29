import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  await connectDB();

  const developers = await User.find({ role: "client", clientType: "developer" })
    .select("_id name email phone phoneCountryCode companyName accountStatus createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ developers });
}
