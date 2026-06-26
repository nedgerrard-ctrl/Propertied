import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET — list all testimonials
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  await connectDB();
  const docs = await Testimonial.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(
    docs.map((d) => ({
      _id:    (d._id as { toString(): string }).toString(),
      quote:  d.quote  as string,
      client: d.client as string,
      image:  (d.image as string | undefined) || undefined,
    }))
  );
}

// POST — add a testimonial
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  let body: { quote?: string; client?: string; image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const quote  = (body.quote  ?? "").trim();
  const client = (body.client ?? "").trim();
  const image  = (body.image  ?? "").trim();

  if (!quote)  return NextResponse.json({ error: "Quote is required."  }, { status: 400 });
  if (!client) return NextResponse.json({ error: "Client is required." }, { status: 400 });

  await connectDB();
  const doc = await Testimonial.create({ quote, client, image: image || "" });

  return NextResponse.json({
    _id:    doc._id.toString(),
    quote:  doc.quote,
    client: doc.client,
    image:  doc.image || undefined,
  });
}
