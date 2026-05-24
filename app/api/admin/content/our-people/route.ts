import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OurPeopleContent from "@/models/OurPeopleContent";
import { mergeOurPeopleContent } from "@/lib/our-people-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await OurPeopleContent.findOne().lean();
  const content = mergeOurPeopleContent(doc as Record<string, unknown> | null);
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
  const content = await OurPeopleContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("our-people");
  return NextResponse.json(content);
}
