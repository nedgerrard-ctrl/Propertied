"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CmsPage = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  contentUpdatedAt: string | null;
};

type CustomPage = {
  _id: string;
  title: string;
  slug: string;
  templateKey: "text-only" | "text-image";
  updatedAt: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ArchivedPagesPage() {
  const [cmsPages, setCmsPages] = useState<CmsPage[]>([]);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsRestoringSlug, setCmsRestoringSlug] = useState<string | null>(null);

  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms-pages/archived")
      .then((r) => r.json())
      .then((data) => { setCmsPages(data); setCmsLoading(false); });

    fetch("/api/admin/pages/archived")
      .then((r) => r.json())
      .then((data) => { setPages(data); setLoading(false); });
  }, []);

  async function restoreCmsPage(page: CmsPage) {
    setCmsRestoringSlug(page.slug);
    const res = await fetch(`/api/admin/cms-pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    setCmsRestoringSlug(null);
    if (res.ok) {
      setCmsPages((prev) => prev.filter((p) => p.slug !== page.slug));
    } else {
      alert("Failed to restore page.");
    }
  }

  async function restoreCustomPage(page: CustomPage) {
    setRestoringId(page._id);
    const res = await fetch(`/api/admin/pages/${page._id}/archive`, { method: "DELETE" });
    setRestoringId(null);
    if (res.ok) {
      setPages((prev) => prev.filter((p) => p._id !== page._id));
    } else {
      alert("Failed to restore page.");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/admin/dashboard/pages"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-neutral-700"
          >
            ← Manage Pages
          </Link>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">PPM Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-neutral-900">Archived Pages</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Archived pages show a 404 on the public site. Restore them to make them live again.
          </p>
        </div>

        {/* ── Archived Site Pages ─────────────────────────────────────────── */}
        <div className="mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Site Pages
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {cmsLoading ? (
            <div className="flex items-center justify-center py-14 text-sm text-neutral-400">Loading…</div>
          ) : cmsPages.length === 0 ? (
            <div className="py-14 text-center text-sm text-neutral-400">No archived site pages.</div>
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
                {cmsPages.map((page) => (
                  <tr key={page.slug} className="bg-orange-50/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{page.name}</p>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        /{page.slug === "landing" ? "" : page.slug}
                      </p>
                    </td>
                    <td className="max-w-[220px] px-6 py-4 text-[12px] text-neutral-500">
                      {page.description || <span className="italic text-neutral-300">No note</span>}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                      {formatDate(page.contentUpdatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => restoreCmsPage(page)}
                        disabled={cmsRestoringSlug === page.slug}
                        className="rounded border border-green-300 bg-green-50 px-3 py-1.5 text-[11px] font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                      >
                        {cmsRestoringSlug === page.slug ? "Restoring…" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Archived Custom Pages ───────────────────────────────────────── */}
        <div className="mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Custom Pages
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-14 text-sm text-neutral-400">Loading…</div>
          ) : pages.length === 0 ? (
            <div className="py-14 text-center text-sm text-neutral-400">No archived custom pages.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Page</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Template</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Archived</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pages.map((page) => (
                  <tr key={page._id} className="bg-orange-50/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{page.title}</p>
                      <p className="mt-1 text-[11px] text-neutral-400">/more/{page.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                        {page.templateKey === "text-image" ? "Text + Image" : "Text Only"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                      {formatDate(page.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => restoreCustomPage(page)}
                        disabled={restoringId === page._id}
                        className="rounded border border-green-300 bg-green-50 px-3 py-1.5 text-[11px] font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                      >
                        {restoringId === page._id ? "Restoring…" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-[11px] text-neutral-400">
          Restoring a site page makes it live immediately. Restoring a custom page sets it back to draft.
        </p>
      </div>
    </main>
  );
}
