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
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();

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

  const result = await Enquiry.deleteMany({
    _id: { $in: ids },
  });

  return NextResponse.json({
    message: "Enquiries deleted successfully",
    deletedCount: result.deletedCount ?? 0,
  });
}