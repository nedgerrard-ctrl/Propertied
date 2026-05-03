import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DeveloperContent from "@/models/DeveloperContent";
import { mergeDeveloperContent } from "@/lib/developer-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await DeveloperContent.findOne().lean();
  const content = mergeDeveloperContent(doc as Record<string, unknown> | null);
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
  const content = await DeveloperContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("developer");
  return NextResponse.json(content);
}
