import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  await connectDB();

  const developers = await User.find({
    role: "client",
    userType: "developer",
    isDeleted: { $ne: true },
  })
    .select("_id name email phone companyName accountStatus pendingApproval createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ developers });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : [];

  if (ids.length === 0) {
    return NextResponse.json({ message: "No developer IDs provided" }, { status: 400 });
  }

  await connectDB();

  const result = await User.updateMany(
    { _id: { $in: ids }, role: "client", userType: "developer" },
    { $set: { isDeleted: true } }
  );

  return NextResponse.json({
    message: "Developers removed successfully",
    deletedCount: result.modifiedCount ?? 0,
  });
}
