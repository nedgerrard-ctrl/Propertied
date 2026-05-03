import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestimonialContent from "@/models/TestimonialContent";
import { mergeTestimonialContent } from "@/lib/testimonial-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await TestimonialContent.findOne().lean();
  const content = mergeTestimonialContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();
  // Save string fields that are non-empty, and number fields (ratings) that are valid numbers
  const updates = Object.fromEntries(
    Object.entries(raw).filter(([key, v]) => {
      if (key.endsWith("Rating")) return typeof v === "number" && !isNaN(v as number);
      return typeof v === "string" && (v as string).trim() !== "";
    })
  );
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }
  const content = await TestimonialContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("testimonial");
  return NextResponse.json(content);
}
