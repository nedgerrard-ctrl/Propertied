import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OffThePlanExplainerContent from "@/models/OffThePlanExplainerContent";
import { mergeOffThePlanExplainerContent } from "@/lib/off-the-plan-explainer-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await OffThePlanExplainerContent.findOne().lean();
  const content = mergeOffThePlanExplainerContent(doc as Record<string, unknown> | null);
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
  const content = await OffThePlanExplainerContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("off-the-plan-explainer");
  return NextResponse.json(content);
}
