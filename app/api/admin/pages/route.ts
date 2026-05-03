import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import {
  createStagedPage,
  mapPageToWebflowFieldData,
} from "@/lib/webflow-admin";

function validateSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    if (!validateSlug(body.slug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase and hyphen-separated." },
        { status: 400 }
      );
    }

    const page = await Page.create({
      ...body,
      templateKey: "simple-info-page",
      syncStatus: "never_synced",
    });

   
    const fieldData = mapPageToWebflowFieldData(page);
    const webflowResult = await createStagedPage(fieldData);
    const webflowItemId = webflowResult.items?.[0]?.id || "";

    page.webflowItemId = webflowItemId;
    page.syncStatus = "staged_synced";
    page.lastSyncedAt = new Date();
    page.syncError = "";
    await page.save();

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create page." },
      { status: 500 }
    );
  }
}