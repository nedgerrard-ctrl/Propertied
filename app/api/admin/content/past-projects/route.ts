import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PastProjectsContent from "@/models/PastProjectsContent";
import { mergePastProjectsContent } from "@/lib/past-projects-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET() {
  await connectDB();
  const doc = await PastProjectsContent.findOne().lean();
  const content = mergePastProjectsContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();

  const updates: Record<string, unknown> = {};

  // Hero flat fields
  const heroFields = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"] as const;
  for (const field of heroFields) {
    if (typeof raw[field] === "string" && raw[field].trim() !== "") {
      updates[field] = raw[field].trim();
    }
  }

  // Projects array — replace entire array when provided
  if (Array.isArray(raw.projects)) {
    updates.projects = raw.projects.map((p: Record<string, string>) => ({
      id:       p.id       ?? "",
      name:     p.name     ?? "",
      address:  p.address  ?? "",
      imageUrl: p.imageUrl ?? "",
      link:     p.link     ?? "",
    }));
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const content = await PastProjectsContent.findOneAndUpdate(
    {},
    { $set: updates },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("past-projects");
  return NextResponse.json(content);
}
