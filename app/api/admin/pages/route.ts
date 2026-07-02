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

export async function GET() {
  await connectDB();
  const pages = await Page.find({ archived: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(pages);
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
  } catch (error: any) {
    console.error(error);
    if (error?.code === 11000 && error?.keyPattern?.slug) {
      return NextResponse.json(
        { error: "A page with that URL slug already exists. Please choose a different slug." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create page. Please try again." },
      { status: 500 }
    );
  }
}