"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  status: "draft" | "published";
  publishDate: string;
  updatedAt: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "Never";

  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);

    const res = await fetch("/api/admin/blogs");
    const data = await res.json();

    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function deletePost(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setMessage("");
    setErrorMessage("");
    setDeletingId(post._id);

    const res = await fetch(`/api/admin/blogs/${post._id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setDeletingId(null);

    if (res.ok) {
      setMessage(data.message || "Blog post deleted successfully.");
      setPosts((prev) => prev.filter((item) => item._id !== post._id));
    } else {
      setErrorMessage(data.error || "Failed to delete blog post.");
    }
  }

  async function togglePublish(post: BlogPost) {
    const action = post.status === "published" ? "unpublish" : "publish";

    setMessage("");
    setErrorMessage("");
    setTogglingId(post._id);

    const res = await fetch(`/api/admin/blogs/${post._id}/${action}`, {
      method: "PATCH",
    });

    const data = await res.json();
    setTogglingId(null);

    if (res.ok) {
      setMessage(data.message || "Blog post updated successfully.");
      setPosts((prev) =>
        prev.map((item) =>
          item._id === post._id
            ? {
                ...item,
                status: post.status === "published" ? "draft" : "published",
              }
            : item
        )
      );
    } else {
      setErrorMessage(data.error || "Failed to update blog post.");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-neutral-700"
            >
              ← Dashboard
            </Link>

            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">
              PPM Admin
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-neutral-900">
              Manage Blogs
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Create, edit, publish, unpublish, and delete Blog / Insights posts.
            </p>
          </div>

          <Link
            href="/admin/dashboard/blogs/new"
            className="rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
          >
            New Blog Post
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-neutral-400">
              Loading…
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-sm text-neutral-400">
              No blog posts found.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Blog Post
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Publish Date
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Status
                  </th>
                  <th className="w-[260px] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Actions
                </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className={`transition ${
                      post.status !== "published" ? "bg-neutral-50/80" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt=""
                            className="h-14 w-20 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded bg-neutral-100 text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900">
                            {post.title}
                          </p>

                          <p className="mt-1 max-w-[360px] truncate text-[12px] text-neutral-500">
                            {post.description}
                          </p>

                          <p className="mt-1 text-[11px] text-neutral-400">
                            /blog/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                      {formatDate(post.updatedAt)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                      {new Date(post.publishDate).toLocaleDateString("en-AU")}
                    </td>

                    <td className="px-6 py-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        
                        <Link
                          href={`/admin/dashboard/blogs/${post._id}`}
                          className="rounded border border-[#5f5245] bg-[#2f2a24] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#1f1a17]"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => togglePublish(post)}
                          disabled={togglingId === post._id}
                          className={`rounded px-3 py-1.5 text-[11px] font-medium transition disabled:opacity-50 ${
                            post.status === "published"
                              ? "border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {togglingId === post._id
                            ? "…"
                            : post.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          onClick={() => deletePost(post)}
                          disabled={deletingId === post._id}
                          className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === post._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-[11px] text-neutral-400">
          Draft posts are hidden from the public Blog page. Only Live posts appear on the website.
        </p>
      </div>
    </main>
  );
}