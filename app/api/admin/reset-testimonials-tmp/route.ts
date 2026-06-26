import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

const SECRET = "ppm-reset-2026-xK9mQ";

export async function DELETE(req: NextRequest) {
  if (req.headers.get("x-reset-secret") !== SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { default: Testimonial } = await import("@/models/Testimonial");
  const result = await Testimonial.deleteMany({});
  return NextResponse.json({ ok: true, deleted: result.deletedCount });
}