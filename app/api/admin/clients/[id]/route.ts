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

  const client = await User.findOne({ _id: id, role: "client" })
    .select("-passwordHash -resetPasswordTokenHash -resetPasswordExpiresAt")
    .lean();

  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }

  const enquiries = await Enquiry.find({ email: client.email })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ client, enquiries });
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

  if (body.restore === true) {
    update.isDeleted = false;
  }

  if ("userType" in body) {
    const validUserTypes = ["buyer_investor", "existing_client"];
    if (!validUserTypes.includes(body.userType as string)) {
      return NextResponse.json({ message: "Invalid user type" }, { status: 400 });
    }
    update.userType = body.userType;
  }

  if ("pendingApproval" in body) {
    update.pendingApproval = Boolean(body.pendingApproval);
  }

  if ("accountStatus" in body) {
    const validStatuses = ["active", "pending-existing-client", "approved-existing-client", "rejected"];
    if (!validStatuses.includes(body.accountStatus as string)) {
      return NextResponse.json({ message: "Invalid account status" }, { status: 400 });
    }
    if (body.accountStatus === "approved-existing-client") {
      await connectDB();
      const target = await User.findOne({ _id: id, role: "client" }).select("emailVerified").lean();
      if (target && !target.emailVerified) {
        return NextResponse.json(
          { message: "Cannot approve: the client has not verified their email address." },
          { status: 422 }
        );
      }
    }
    update.accountStatus = body.accountStatus;
  }

  if ("clientType" in body) {
    const validClientTypes = ["investor", "owner-occupier", ""];
    if (!validClientTypes.includes(body.clientType as string)) {
      return NextResponse.json({ message: "Invalid client type" }, { status: 400 });
    }
    update.clientType = body.clientType;
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

  const client = await User.findOneAndUpdate(
    { _id: id, role: "client" },
    { $set: update },
    { new: true }
  )
    .select("-passwordHash -resetPasswordTokenHash -resetPasswordExpiresAt")
    .lean();

  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const permanent = req.nextUrl.searchParams.get("permanent") === "true";

  await connectDB();

  if (permanent) {
    const result = await User.deleteOne({ _id: id, role: "client" });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Client permanently deleted." });
  }

  const client = await User.findOneAndUpdate(
    { _id: id, role: "client", isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Client removed successfully" });
}
