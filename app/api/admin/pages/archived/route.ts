import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET() {
  await connectDB();
  const pages = await Page.find({ archived: true }).sort({ updatedAt: -1 }).lean();
  return NextResponse.json(pages);
}
