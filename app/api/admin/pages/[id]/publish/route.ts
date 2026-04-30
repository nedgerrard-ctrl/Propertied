import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import {
  createStagedPage,
  mapPageToWebflowFieldData,
  publishPageItems,
  updateStagedPage,
} from "@/lib/webflow-admin";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_req: NextRequest, context: Context) {
  await connectDB();

  try {
    const { id } = await context.params;
    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    const fieldData = mapPageToWebflowFieldData(page);

    if (page.webflowItemId) {
      await updateStagedPage(page.webflowItemId, fieldData);
    } else {
      const webflowResult = await createStagedPage(fieldData);
      page.webflowItemId = webflowResult.items?.[0]?.id || "";
    }

    await publishPageItems([page.webflowItemId]);

    page.status = "published";
    page.syncStatus = "published_synced";
    page.lastSyncedAt = new Date();
    page.syncError = "";
    await page.save();

    return NextResponse.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to publish page." },
      { status: 500 }
    );
  }
}