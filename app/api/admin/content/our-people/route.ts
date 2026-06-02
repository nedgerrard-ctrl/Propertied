import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OurPeopleContent from "@/models/OurPeopleContent";
import { mergeOurPeopleContent } from "@/lib/our-people-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

const HERO_FIELDS = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"] as const;
type HeroField = (typeof HERO_FIELDS)[number];

export async function GET() {
  await connectDB();
  const doc = await OurPeopleContent.findOne().lean();
  const content = mergeOurPeopleContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();

  const updates: Record<string, unknown> = {};

  // Hero string fields
  for (const field of HERO_FIELDS) {
    if (typeof raw[field] === "string" && (raw[field] as string).trim()) {
      updates[field] = (raw[field] as string).trim();
    }
  }

  // People array
  if (Array.isArray(raw.people)) {
    updates.people = raw.people;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const content = await OurPeopleContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: false }
  );
  await touchCmsPage("our-people");
  return NextResponse.json(content);
}
