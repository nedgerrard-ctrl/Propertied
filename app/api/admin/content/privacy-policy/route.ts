import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrivacyPolicyContent from "@/models/PrivacyPolicyContent";
import { mergePrivacyPolicyContent } from "@/lib/privacy-policy-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await PrivacyPolicyContent.findOne().lean();
  const content = mergePrivacyPolicyContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();
  const updates: Record<string, unknown> = Object.fromEntries(
    Object.entries(raw).filter(([k, v]) => k !== "sectionOverrides" && typeof v === "string" && (v as string).trim() !== "")
  );
  if (raw.sectionOverrides && typeof raw.sectionOverrides === "object") {
    updates.sectionOverrides = raw.sectionOverrides;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }
  const content = await PrivacyPolicyContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("privacy-policy");
  return NextResponse.json(content);
}
