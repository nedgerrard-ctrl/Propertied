import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BuyerContent from "@/models/BuyerContent";
import { mergeBuyerContent } from "@/lib/buyer-defaults";
import { touchCmsPage } from "@/lib/touch-cms-page";

export async function GET(req: NextRequest) {
  await connectDB();
  const section = req.nextUrl.searchParams.get("section") as "investors" | "owner-occupiers" | null;
  const filter = section ? { section } : {};
  const doc = await BuyerContent.findOne(filter).lean();
  const content = mergeBuyerContent(doc as Record<string, unknown> | null);
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const raw = await req.json();
  const { section, ...rest } = raw;
  // Only save fields that have actual content — never overwrite with empty strings
  const updates = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => typeof v === "string" && v.trim() !== "")
  );
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }
  const filter = section ? { section } : {};
  const content = await BuyerContent.findOneAndUpdate(
    filter,
    { $set: { ...(section ? { section } : {}), ...updates } },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  await touchCmsPage("buyer");
  return NextResponse.json(content);
}
