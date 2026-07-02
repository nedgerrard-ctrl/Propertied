import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["pending", "qualified", "in-progress", "closed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  await connectDB();
  const enquiry = await Enquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  if (!enquiry) {
    return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ enquiry });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();

  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!enquiry) {
    return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Enquiry removed successfully" });
}