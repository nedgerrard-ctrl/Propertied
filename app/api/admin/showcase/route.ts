import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ShowcaseProject from "@/models/ShowcaseProject";

export async function GET() {
  await connectDB();
  const projects = await ShowcaseProject.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, address, image, order, published } = body;

  if (!name?.trim() || !address?.trim()) {
    return NextResponse.json({ error: "Name and address are required." }, { status: 400 });
  }

  const project = await ShowcaseProject.create({
    name: name.trim(),
    address: address.trim(),
    image: image?.trim() ?? "",
    order: typeof order === "number" ? order : 0,
    published: published !== false,
  });

  return NextResponse.json(project, { status: 201 });
}
