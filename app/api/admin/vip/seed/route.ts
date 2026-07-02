import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VipPost from "@/models/VipPost";
import { ARTICLES } from "@/app/client/vip/articles";

function parseMonthYear(value: string) {
  const date = new Date(`${value} 1`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function POST() {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const article of ARTICLES) {
    const existing = await VipPost.findOne({ slug: article.slug });

    if (existing) {
      skipped++;
      continue;
    }

    await VipPost.create({
      title: article.title,
      slug: article.slug,
      description: article.excerpt,
      image: "",
      publishDate: parseMonthYear(article.date),
      category: article.category,
      status: "published",
      publishedAt: new Date(),
      content: article.content.map((section) => ({
        heading: section.heading || "",
        body: section.body,
        image: "",
      })),
    });

    created++;
  }

  return NextResponse.json({
    message: `Seed complete. Created ${created} VIP posts. Skipped ${skipped} existing posts.`,
  });
}
