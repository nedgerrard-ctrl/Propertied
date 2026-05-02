import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "developer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const email = session.user.email?.toLowerCase();
  const phone = session.user.phone?.replace(/\s|-/g, "").trim();

  const query = phone
    ? { $or: [{ email }, { phone }] }
    : { email };

  const enquiries = await Enquiry.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ enquiries });
}
