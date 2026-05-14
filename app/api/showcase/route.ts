import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ShowcaseProject from "@/models/ShowcaseProject";

export async function GET() {
  await connectDB();
  const projects = await ShowcaseProject.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return NextResponse.json(projects);
}
