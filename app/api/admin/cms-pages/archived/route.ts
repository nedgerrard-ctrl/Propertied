import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsPageConfig from "@/models/CmsPageConfig";

export async function GET() {
  await connectDB();
  const docs = await CmsPageConfig.find({ archived: true }).sort({ name: 1 }).lean();
  return NextResponse.json(docs);
}
