import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FooterContent from "@/models/FooterContent";
import { footerDefaults, mergeFooterContent } from "@/lib/footer-defaults";

const CACHE = "s-maxage=60, stale-while-revalidate=300";

export async function GET() {
  await connectDB();
  const doc = await FooterContent.findOne({ archived: { $ne: true } }).lean() as Record<string, unknown> | null;

  // No doc, archived, or explicitly unpublished → serve static defaults
  if (!doc || doc.published === false) {
    return NextResponse.json(footerDefaults, {
      headers: { "Cache-Control": CACHE },
    });
  }

  const content = mergeFooterContent(doc);
  return NextResponse.json(content, {
    headers: { "Cache-Control": CACHE },
  });
}
