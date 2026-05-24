import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import InsightsContent from "@/models/InsightsContent";
import { mergeInsightsContent } from "@/lib/insights-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await InsightsContent.findOne().lean();
  const content = mergeInsightsContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();
  const updates = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => typeof v === "string" && v.trim() !== "")
  );
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }
  const content = await InsightsContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("insights");
  return NextResponse.json(content);
}
