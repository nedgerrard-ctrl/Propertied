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

const EDIT_LINKS: Record<string, string> = {
  landing:     "/admin/dashboard/content/landing",
  about:       "/admin/dashboard/content/about",
  buyer:       "/admin/dashboard/content/buyer",
  developer:   "/admin/dashboard/content/developer",
  testimonial: "/admin/dashboard/content/testimonial",
};

const PREVIEW_LINKS: Record<string, string> = {
  landing:     "/",
  about:       "/about",
  buyer:       "/buyers",
  developer:   "/developer",
  testimonial: "/testimonial",
};

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ManageCmsPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [editingDesc, setEditingDesc] = useState<string | null>(null);
  const [descDraft, setDescDraft] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cms-pages")
      .then((r) => r.json())
      .then((data) => { setPages(data); setLoading(false); });
  }, []);

  async function togglePublish(page: CmsPage) {
    setTogglingSlug(page.slug);
    const res = await fetch(`/api/admin/cms-pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !page.published }),
    });
    setTogglingSlug(null);
    if (res.ok) {
      setPages((prev) =>
        prev.map((p) => (p.slug === page.slug ? { ...p, published: !page.published } : p))
      );
    } else alert("Failed to update page status.");
  }

  async function deletePage(page: CmsPage) {
    if (!confirm(`Remove "${page.name}" from the managed pages list? The page will still exist on the site.`)) return;
    setDeletingSlug(page.slug);
    await fetch(`/api/admin/cms-pages/${page.slug}`, { method: "DELETE" });
    setDeletingSlug(null);
    setPages((prev) => prev.filter((p) => p.slug !== page.slug));
  }

  async function saveDescription(slug: string) {
    setSavingDesc(true);
    const res = await fetch(`/api/admin/cms-pages/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: descDraft }),
    });
    setSavingDesc(false);
    if (res.ok) {
      setPages((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, description: descDraft } : p))
      );
      setEditingDesc(null);
    } else alert("Failed to save description.");
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-700 transition"
            >
              ← Dashboard
            </Link>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">PPM Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-neutral-900">Manage Pages</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Control the live status and content of each CMS page.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Loading…</div>
          ) : pages.length === 0 ? (
            <div className="py-20 text-center text-sm text-neutral-400">No pages found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Page</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Admin Note</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Last Updated</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Status</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pages.map((page) => (
                  <tr key={page.slug} className={`transition ${!page.published ? "bg-neutral-50/80" : ""}`}>
                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{page.name}</p>
                      <p className="text-[11px] text-neutral-400">/{page.slug === "landing" ? "" : page.slug}</p>
                    </td>

                    {/* Admin note / description */}
                    <td className="px-6 py-4 max-w-[220px]">
                      {editingDesc === page.slug ? (
                        <div className="space-y-2">
                          <textarea
                            autoFocus
                            value={descDraft}
                            onChange={(e) => setDescDraft(e.target.value)}
                            rows={2}
                            className="w-full rounded border border-neutral-300 px-2 py-1.5 text-[12px] text-neutral-700 focus:border-amber-400 focus:outline-none resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveDescription(page.slug)}
                              disabled={savingDesc}
                              className="rounded bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black transition hover:bg-amber-300 disabled:opacity-50"
                            >
                              {savingDesc ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingDesc(null)}
                              className="rounded border border-neutral-200 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500 transition hover:border-neutral-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingDesc(page.slug); setDescDraft(page.description || ""); }}
                          className="group flex w-full items-start gap-1.5 text-left"
                          title="Click to edit admin note"
                        >
                          <span className="text-[12px] leading-relaxed text-neutral-500">
                            {page.description || <span className="italic text-neutral-300">Add a note…</span>}
                          </span>
                          <svg className="mt-0.5 h-3 w-3 shrink-0 text-neutral-300 opacity-0 transition group-hover:opacity-100" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
                          </svg>
                        </button>
                      )}
                    </td>

                    {/* Last updated */}
                    <td className="px-6 py-4 text-[12px] text-neutral-500 whitespace-nowrap">
                      {formatDate(page.contentUpdatedAt)}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      {page.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700 border border-green-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-500 border border-neutral-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          Hidden
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Preview */}
                        <a
                          href={PREVIEW_LINKS[page.slug] ?? `/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded border border-neutral-200 px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
                        >
                          Preview ↗
                        </a>
                        {/* Edit */}
                        {EDIT_LINKS[page.slug] && (
                          <Link
                            href={EDIT_LINKS[page.slug]}
                            className="rounded border border-[#5f5245] bg-[#2f2a24] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#1f1a17]"
                          >
                            Edit
                          </Link>
                        )}
                        {/* Publish / Unpublish */}
                        <button
                          onClick={() => togglePublish(page)}
                          disabled={togglingSlug === page.slug}
                          className={`rounded px-3 py-1.5 text-[11px] font-medium transition disabled:opacity-50 ${page.published ? "border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"}`}
                        >
                          {togglingSlug === page.slug ? "…" : page.published ? "Unpublish" : "Publish"}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => deletePage(page)}
                          disabled={deletingSlug === page.slug}
                          className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingSlug === page.slug ? "…" : "Delete"}
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
          Admin notes are for internal use only and are never shown on the public site. Last Updated reflects when content was last saved via the editor.
        </p>
      </div>
    </main>
  );
}
