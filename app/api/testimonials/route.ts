import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  await connectDB();
  const docs = await Testimonial.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(docs);
}
