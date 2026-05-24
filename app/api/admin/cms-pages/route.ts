import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsPageConfig from "@/models/CmsPageConfig";

const SEED_PAGES = [
  { slug: "landing",     name: "Home",         description: "Main landing page with hero, services, and CTA sections.", published: true },
  { slug: "about",       name: "About Us",      description: "Company story, team, and values.", published: true },
  { slug: "our-people",  name: "Our People",    description: "Team profiles — Joan, Ned, Chris, and George.", published: true },
  { slug: "buyer",       name: "Buyers",        description: "Buyer-focused page with project listings and buyer guides.", published: true },
  { slug: "developer",   name: "Developer",     description: "Developer partnership and off-plan project information.", published: true },
  { slug: "testimonial", name: "Testimonials",  description: "Client testimonials and reviews.", published: true },
];

export async function GET() {
  await connectDB();
  // Upsert each seed page by slug so missing entries are always restored
  for (const page of SEED_PAGES) {
    await CmsPageConfig.updateOne(
      { slug: page.slug },
      { $setOnInsert: page },
      { upsert: true }
    );
  }
  const docs = await CmsPageConfig.find({ archived: { $ne: true } }).sort({ name: 1 }).lean();
  return NextResponse.json(docs);
}
