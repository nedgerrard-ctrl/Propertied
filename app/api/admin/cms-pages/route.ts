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
  { slug: "insights",               name: "Insights",             description: "Market intelligence and budget insights for property investors.", published: true },
  { slug: "off-the-plan-explainer", name: "Off-the-Plan Explainer", description: "Buyer education guide — what off-the-plan means, the six advantages, and 2026 Budget tax reforms.", published: true },
  { slug: "full-disclaimer",        name: "Full Disclaimer",        description: "Legal and regulatory disclosures — licence, acquisition fees, tax notices, and stamp duty caveats.", published: true },
  { slug: "privacy-policy",         name: "Privacy Policy",         description: "How PPM collects, uses, and protects personal information in accordance with the Privacy Act 1988.", published: true },
  { slug: "past-projects",          name: "Past Projects",          description: "Card grid of past Melbourne developments. Add, remove, and reorder project cards.", published: true },
  { slug: "blog",                   name: "Blog",                   description: "Blog listing page — hero heading and subtext. Individual posts managed in Blogs section.", published: true },
  { slug: "resources",              name: "Resources",              description: "Downloadable forms and documents for tenants, owners, investors, and partners.", published: true },
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
