import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ResourcesContent from "@/models/ResourcesContent";
import { mergeResourcesContent, ResourceSection } from "@/lib/resources-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await ResourcesContent.findOne().lean();
  const content = mergeResourcesContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();
  const updates: Record<string, unknown> = {};

  // Flat hero + footer fields
  const stringFields = [
    "heroHeadingMain",
    "heroHeadingAccent",
    "heroSubtext",
    "footerNote",
    "footerEmail",
  ] as const;

  for (const field of stringFields) {
    if (typeof raw[field] === "string" && raw[field].trim() !== "") {
      updates[field] = raw[field].trim();
    }
  }

  // Sections array — replace entire array when provided
  if (Array.isArray(raw.sections)) {
    updates.sections = (raw.sections as ResourceSection[]).map((section) => ({
      id:      section.id      ?? "",
      heading: section.heading ?? "",
      items: Array.isArray(section.items)
        ? section.items.map((item) => ({
            id:       item.id       ?? "",
            label:    item.label    ?? "",
            fileUrl:  item.fileUrl  ?? "",
            fileName: item.fileName ?? "",
          }))
        : [],
    }));
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const content = await ResourcesContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("resources");
  return NextResponse.json(content);
}
