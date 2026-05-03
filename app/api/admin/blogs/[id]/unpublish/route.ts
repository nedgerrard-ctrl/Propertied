// app/api/admin/blogs/[id]/unpublish/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const post = await BlogPost.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "draft",
      },
    },
    { new: true }
  );

  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Blog post unpublished successfully.",
    post,
  });
}