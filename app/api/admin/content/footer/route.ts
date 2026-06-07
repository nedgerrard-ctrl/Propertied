import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FooterContent from "@/models/FooterContent";
import { mergeFooterContent } from "@/lib/footer-defaults";

export async function GET() {
  await connectDB();
  const doc = await FooterContent.findOne().lean() as Record<string, unknown> | null;
  const content = mergeFooterContent(doc);
  return NextResponse.json({
    ...content,
    published: (doc?.published as boolean) ?? true,
    archived:  (doc?.archived  as boolean) ?? false,
  });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();

  // Accept string fields (content) and boolean fields (published, archived)
  const updates = Object.fromEntries(
    Object.entries(raw).filter(
      ([, v]) => typeof v === "string" || typeof v === "boolean"
    )
  );

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const doc = await FooterContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );

  return NextResponse.json({
    published: doc?.published ?? true,
    archived:  doc?.archived  ?? false,
  });
}
