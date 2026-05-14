import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VipPost from "@/models/VipPost";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const post = await VipPost.findById(id).lean();

  if (!post) {
    return NextResponse.json({ error: "VIP post not found." }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const publishDate = String(body.publishDate || "").trim();
  const content = Array.isArray(body.content) ? body.content : [];

  if (!title || !description || !publishDate || content.length === 0) {
    return NextResponse.json(
      { error: "Title, description, publish date, and body are required." },
      { status: 400 }
    );
  }

  const status = body.status === "published" ? "published" : "draft";

  const post = await VipPost.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        description,
        publishDate: new Date(publishDate),
        category: String(body.category || "VIP Insights").trim(),
        image: String(body.image || "").trim(),
        content: content
          .map((section: any) => ({
            heading: String(section.heading || "").trim(),
            body: String(section.body || "").trim(),
            image: String(section.image || "").trim(),
          }))
          .filter((section: any) => section.body),
        status,
        publishedAt: status === "published" ? new Date() : null,
      },
    },
    { new: true, runValidators: true }
  );

  if (!post) {
    return NextResponse.json({ error: "VIP post not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "VIP post updated successfully.",
    post,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const post = await VipPost.findByIdAndDelete(id);

  if (!post) {
    return NextResponse.json({ error: "VIP post not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "VIP post deleted successfully." });
}
