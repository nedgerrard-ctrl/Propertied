import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  await connectDB();
  const docs = await Project.find({ published: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(docs);
}
