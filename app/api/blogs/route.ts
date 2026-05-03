// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { formatBlogDate } from "@/lib/blog-utils";

export async function GET() {
  await connectDB();

  const posts = await BlogPost.find({ status: "published" })
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();

  return NextResponse.json(
    posts.map((post: any) => ({
      id: String(post._id),
      slug: post.slug,
      title: post.title,
      description: post.description,
      image: post.image,
      date: formatBlogDate(post.publishDate),
      category: post.category,
    }))
  );
}