// app/api/blogs/[slug]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { formatBlogDate } from "@/lib/blog-utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;

  const post = await BlogPost.findOne({
    slug,
    status: "published",
  }).lean();

  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: String((post as any)._id),
    slug: (post as any).slug,
    title: (post as any).title,
    description: (post as any).description,
    image: (post as any).image,
    date: formatBlogDate((post as any).publishDate),
    category: (post as any).category,
    content: (post as any).content,
  });
}