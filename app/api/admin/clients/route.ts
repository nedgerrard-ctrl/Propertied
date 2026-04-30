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

  const clients = await User.find({
    role: "client",
    userType: { $in: ["buyer_investor", "existing_client"] },
  })
    .select("_id name email phone userType pendingApproval createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ clients });
}
