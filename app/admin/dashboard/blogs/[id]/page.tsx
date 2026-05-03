import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogForm from "../blog-form";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();

  const { id } = await params;
  const post = await BlogPost.findById(id).lean();

  if (!post) notFound();

  const data = JSON.parse(JSON.stringify(post));

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/dashboard/blogs"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-neutral-700"
        >
          ← Manage Blogs
        </Link>

        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">
          PPM Admin
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-neutral-900">
          Edit Blog Post
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Update the blog content, upload images, or change its publish status.
        </p>

        <BlogForm initialData={data} />
      </div>
    </main>
  );
}