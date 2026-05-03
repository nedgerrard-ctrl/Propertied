import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { projects as SEED_PROJECTS } from "@/lib/projects-data";

export async function GET() {
  await connectDB();
  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany(
      SEED_PROJECTS.map(({ id: _omit, ...rest }) => rest)
    );
  }
  const docs = await Project.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, suburb, state, type, propertyInterest, status, bedrooms, bathrooms, carSpaces, priceFrom, description, highlights, image } = body;

  if (!name?.trim() || !suburb?.trim() || !type || !propertyInterest || !bedrooms?.trim() || !bathrooms?.trim() || !carSpaces?.trim() || !priceFrom?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
  }

  const doc = await Project.create({
    name: name.trim(),
    suburb: suburb.trim(),
    state: (state || "VIC").trim(),
    type,
    propertyInterest,
    status: status || "Current",
    bedrooms: bedrooms.trim(),
    bathrooms: bathrooms.trim(),
    carSpaces: carSpaces.trim(),
    priceFrom: priceFrom.trim(),
    description: description.trim(),
    highlights: Array.isArray(highlights) ? highlights.filter(Boolean) : [],
    image: image || "",
  });
  return NextResponse.json(doc, { status: 201 });
}
