import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_req: NextRequest, context: Context) {
  await connectDB();

  try {
    const { id } = await context.params;

    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }


    page.status = "draft";


    page.syncStatus = "staged_synced";

    await page.save();

    return NextResponse.json({
      success: true,
      message: "Page unpublished (now draft)",
      page,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to unpublish page" },
      { status: 500 }
    );
  }
}