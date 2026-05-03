// app/api/admin/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { slugify } from "@/lib/blog-utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const post = await BlogPost.findById(id).lean();

  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
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

  const slug = body.slug ? slugify(body.slug) : slugify(title);

  const duplicate = await BlogPost.findOne({
    slug,
    _id: { $ne: id },
  }).lean();

  if (duplicate) {
    return NextResponse.json(
      { error: "A blog post with this slug already exists." },
      { status: 400 }
    );
  }

  const status = body.status === "published" ? "published" : "draft";

  const post = await BlogPost.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        slug,
        description,
        publishDate: new Date(publishDate),
        category: String(body.category || "Insights").trim(),
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
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Blog post updated successfully.",
    post,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const post = await BlogPost.findByIdAndDelete(id);

  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Blog post deleted successfully.",
  });
}