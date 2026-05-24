import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPageContent from "@/models/BlogPageContent";
import { mergeBlogPageContent } from "@/lib/blog-page-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await BlogPageContent.findOne().lean();
  const content = mergeBlogPageContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();

  const allowed = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"] as const;
  const updates: Record<string, string> = {};

  for (const field of allowed) {
    if (typeof raw[field] === "string" && raw[field].trim() !== "") {
      updates[field] = raw[field].trim();
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const content = await BlogPageContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("blog");
  return NextResponse.json(content);
}
