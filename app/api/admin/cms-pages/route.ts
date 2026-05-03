import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CmsPageConfig from "@/models/CmsPageConfig";

const SEED_PAGES = [
  { slug: "landing",     name: "Home",         description: "Main landing page with hero, services, and CTA sections.", published: true },
  { slug: "about",       name: "About Us",      description: "Company story, team, and values.", published: true },
  { slug: "buyer",       name: "Buyers",        description: "Buyer-focused page with project listings and buyer guides.", published: true },
  { slug: "developer",   name: "Developer",     description: "Developer partnership and off-plan project information.", published: true },
  { slug: "testimonial", name: "Testimonials",  description: "Client testimonials and reviews.", published: true },
];

export async function GET() {
  await connectDB();
  const count = await CmsPageConfig.countDocuments();
  if (count === 0) {
    await CmsPageConfig.insertMany(SEED_PAGES);
  }
  const docs = await CmsPageConfig.find().sort({ name: 1 }).lean();
  return NextResponse.json(docs);
}
