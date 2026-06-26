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

// PATCH — update a testimonial
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;

  let body: { quote?: string; client?: string; image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (body.quote  !== undefined) updates.quote  = body.quote.trim();
  if (body.client !== undefined) updates.client = body.client.trim();
  if (body.image  !== undefined) updates.image  = body.image.trim();

  if (updates.quote  === "") return NextResponse.json({ error: "Quote cannot be empty."  }, { status: 400 });
  if (updates.client === "") return NextResponse.json({ error: "Client cannot be empty." }, { status: 400 });

  await connectDB();
  const doc = await Testimonial.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({
    _id:    (doc._id as { toString(): string }).toString(),
    quote:  doc.quote  as string,
    client: doc.client as string,
    image:  (doc.image as string | undefined) || undefined,
  });
}

// DELETE — remove a testimonial
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;

  await connectDB();
  const doc = await Testimonial.findByIdAndDelete(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
