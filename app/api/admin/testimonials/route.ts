import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  await connectDB();
  const docs = await Testimonial.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { quote, client, rating, image } = await req.json();

  if (!quote?.trim() || !client?.trim()) {
    return NextResponse.json({ error: "Quote and client are required." }, { status: 400 });
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return NextResponse.json({ error: "Rating must be 1–5." }, { status: 400 });
  }

  const doc = await Testimonial.create({
    quote: quote.trim(),
    client: client.trim(),
    rating: r,
    image: typeof image === "string" ? image.trim() : "",
  });
  return NextResponse.json(doc, { status: 201 });
}
