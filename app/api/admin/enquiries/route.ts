import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  await connectDB();
  const enquiries = await Enquiry.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ enquiries });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : [];

  if (ids.length === 0) {
    return NextResponse.json(
      { message: "No enquiry IDs provided" },
      { status: 400 }
    );
  }

  await connectDB();

  const result = await Enquiry.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } }
  );

  return NextResponse.json({
    message: "Enquiries removed successfully",
    deletedCount: result.modifiedCount ?? 0,
  });
}