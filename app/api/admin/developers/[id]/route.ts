import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Enquiry from "@/models/Enquiry";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();

  const developer = await User.findOne({ _id: id, role: "client", clientType: "developer" })
    .select("-passwordHash -resetPasswordTokenHash -resetPasswordExpiresAt")
    .lean();

  if (!developer) {
    return NextResponse.json({ message: "Developer not found" }, { status: 404 });
  }

  const enquiries = await Enquiry.find({ email: developer.email })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ developer, enquiries });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  const validStatuses = ["active", "pending-existing-client", "approved-existing-client"];

  if ("accountStatus" in body) {
    if (!validStatuses.includes(body.accountStatus as string)) {
      return NextResponse.json({ message: "Invalid account status" }, { status: 400 });
    }
    update.accountStatus = body.accountStatus;
  }

  if ("adminNotes" in body) {
    const notes = String(body.adminNotes ?? "").trim();
    if (notes.length > 2000) {
      return NextResponse.json(
        { message: "Notes are too long (max 2000 characters)" },
        { status: 400 }
      );
    }
    update.adminNotes = notes;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
  }

  await connectDB();

  const developer = await User.findOneAndUpdate(
    { _id: id, role: "client", clientType: "developer" },
    update,
    { new: true }
  )
    .select("-passwordHash -resetPasswordTokenHash -resetPasswordExpiresAt")
    .lean();

  if (!developer) {
    return NextResponse.json({ message: "Developer not found" }, { status: 404 });
  }

  return NextResponse.json({ developer });
}
