import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const deleted = await Testimonial.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, string> = {};
  if (typeof body.quote === "string" && body.quote.trim()) updates.quote = body.quote.trim();
  if (typeof body.client === "string" && body.client.trim()) updates.client = body.client.trim();
  if (typeof body.image === "string") updates.image = body.image;
  const doc = await Testimonial.findByIdAndUpdate(id, { $set: updates }, { new: true });
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ _id: doc._id, quote: doc.quote, client: doc.client, rating: doc.rating, image: doc.image ?? "" });
}
