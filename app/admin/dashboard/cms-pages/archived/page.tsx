"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CmsPage = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  published: boolean;
  contentUpdatedAt: string | null;
  updatedAt: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ArchivedCmsPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringSlug, setRestoringSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms-pages/archived")
      .then((r) => r.json())
      .then((data) => { setPages(data); setLoading(false); });
  }, []);

  async function restorePage(page: CmsPage) {
    setRestoringSlug(page.slug);
    const res = await fetch(`/api/admin/cms-pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    setRestoringSlug(null);
    if (res.ok) {
      setPages((prev) => prev.filter((p) => p.slug !== page.slug));
    } else {
      alert("Failed to restore page.");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard/cms-pages"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-700 transition"
          >
            ← Manage Pages
          </Link>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">PPM Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-neutral-900">Archived Pages</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Archived pages show a 404 on the public site. Restore them to make them live again.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Loading…</div>
          ) : pages.length === 0 ? (
            <div className="py-20 text-center text-sm text-neutral-400">No archived pages.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Page</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Admin Note</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Last Updated</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pages.map((page) => (
                  <tr key={page.slug} className="bg-orange-50/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{page.name}</p>
                      <p className="text-[11px] text-neutral-400">/{page.slug === "landing" ? "" : page.slug}</p>
                    </td>
                    <td className="px-6 py-4 max-w-[220px] text-[12px] text-neutral-500">
                      {page.description || <span className="italic text-neutral-300">No note</span>}
                    </td>
                    <td className="px-6 py-4 text-[12px] text-neutral-500 whitespace-nowrap">
                      {formatDate(page.contentUpdatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => restorePage(page)}
                        disabled={restoringSlug === page.slug}
                        className="rounded border border-green-300 bg-green-50 px-3 py-1.5 text-[11px] font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                      >
                        {restoringSlug === page.slug ? "Restoring…" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-[11px] text-neutral-400">
          Restoring a page makes it live again on the public site immediately.
        </p>
      </div>
    </main>
  );
}
