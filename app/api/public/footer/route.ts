import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FooterContent from "@/models/FooterContent";
import { mergeFooterContent } from "@/lib/footer-defaults";

export async function GET() {
  try {
    await connectDB();
    const doc = await FooterContent.findOne().lean();
    const content = mergeFooterContent(doc as Record<string, unknown> | null);

    return NextResponse.json(
      { success: true, content },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching footer content:", error);
    // Return defaults on error so footer still renders
    const content = mergeFooterContent(null);
    return NextResponse.json({ success: true, content }, { status: 200 });
  }
}
