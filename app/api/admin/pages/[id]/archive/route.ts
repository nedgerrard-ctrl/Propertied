import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: NextRequest, context: Context) {
  await connectDB();

  try {
    const { id } = await context.params;
    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    page.archived = false;
    await page.save();

    return NextResponse.json({ success: true, message: "Page restored." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to restore page." }, { status: 500 });
  }
}

export async function POST(_req: NextRequest, context: Context) {
  await connectDB();

  try {
    const { id } = await context.params;
    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    page.archived = true;
    page.status = "draft";
    await page.save();

    return NextResponse.json({ success: true, message: "Page archived." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to archive page." }, { status: 500 });
  }
}
