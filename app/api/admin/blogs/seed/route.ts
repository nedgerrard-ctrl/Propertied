import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { blogPosts } from "@/lib/blog-data";

function parseMonthYear(value: string) {
  // Example: "March 2026"
  const date = new Date(`${value} 1`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function POST() {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const post of blogPosts) {
    const existing = await BlogPost.findOne({ slug: post.slug });

    if (existing) {
      skipped++;
      continue;
    }

    await BlogPost.create({
      title: post.title,
      slug: post.slug,
      description: post.description,
      image: post.image || "",
      publishDate: parseMonthYear(post.date),
      category: post.category || "Insights",
      status: "published",
      publishedAt: new Date(),
      content: post.content.map((section) => ({
        heading: section.heading || "",
        body: section.body,
        image: "",
      })),
    });

    created++;
  }

  return NextResponse.json({
    message: `Seed complete. Created ${created} blog posts. Skipped ${skipped} existing posts.`,
  });
}