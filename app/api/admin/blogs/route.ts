// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { slugify } from "@/lib/blog-utils";

export async function GET() {
  await connectDB();

  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  await connectDB();

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

  const slugBase = body.slug ? slugify(body.slug) : slugify(title);

  const existing = await BlogPost.findOne({ slug: slugBase }).lean();
  if (existing) {
    return NextResponse.json(
      { error: "A blog post with this slug already exists." },
      { status: 400 }
    );
  }

  const status = body.status === "published" ? "published" : "draft";

  const post = await BlogPost.create({
    title,
    slug: slugBase,
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
  });

  return NextResponse.json({
    message: status === "published" ? "Blog post published successfully." : "Blog post saved as draft successfully.",
    post,
  });
}