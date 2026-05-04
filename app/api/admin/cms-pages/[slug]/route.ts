import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsPageConfig from "@/models/CmsPageConfig";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;
  const body = await req.json();
  const allowed: Record<string, unknown> = {};
  if ("published"   in body) allowed.published   = body.published;
  if ("description" in body) allowed.description = body.description;
  if ("archived"    in body) allowed.archived    = body.archived;

  const doc = await CmsPageConfig.findOneAndUpdate(
    { slug },
    { $set: allowed },
    { new: true }
  );
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();
  const { slug } = await params;
  await CmsPageConfig.findOneAndDelete({ slug });
  return NextResponse.json({ ok: true });
}
