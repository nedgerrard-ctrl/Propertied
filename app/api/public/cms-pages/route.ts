import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsPageConfig from "@/models/CmsPageConfig";

export async function GET() {
  await connectDB();
  const docs = await CmsPageConfig.find(
    { archived: { $ne: true }, published: true },
    { slug: 1, _id: 0 }
  ).lean() as { slug: string }[];
  return NextResponse.json(docs.map((d) => d.slug));
}
