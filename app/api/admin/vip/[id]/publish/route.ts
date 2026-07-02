import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VipPost from "@/models/VipPost";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const post = await VipPost.findByIdAndUpdate(
    id,
    { $set: { status: "published", publishedAt: new Date() } },
    { new: true }
  );

  if (!post) {
    return NextResponse.json({ error: "VIP post not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "VIP post published successfully.", post });
}
