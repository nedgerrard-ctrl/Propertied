import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AboutContent from "@/models/AboutContent";
import { mergeAboutContent } from "@/lib/about-defaults";

export async function GET() {
  await connectDB();
  const doc = await AboutContent.findOne().lean();
  const content = mergeAboutContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();
  // Only save fields that have actual content — never overwrite with empty strings
  const updates = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => typeof v === "string" && v.trim() !== "")
  );
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }
  const content = await AboutContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  return NextResponse.json(content);
}
