"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

type CmsPage = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  published: boolean;
  archived: boolean;
  contentUpdatedAt: string | null;
  updatedAt: string;
};

type CustomPage = {
  _id: string;
  title: string;
  slug: string;
  templateKey: "text-only" | "text-image";
  status: "draft" | "published";
  updatedAt: string;
};

// ── Constants ──────────────────────────────────────────────────────────────

const CMS_EDIT_LINKS: Record<string, string> = {
  landing:     "/admin/dashboard/content/landing",
  about:       "/admin/dashboard/content/about",
  "our-people": "/admin/dashboard/content/our-people",
  buyer:       "/admin/dashboard/content/buyer",
  developer:   "/admin/dashboard/content/developer",
  testimonial: "/admin/dashboard/content/testimonial",
  insights:    "/admin/dashboard/content/insights",
};

const CMS_PREVIEW_LINKS: Record<string, string> = {
  landing:     "/",
  about:       "/about",
  "our-people": "/our-people",
  buyer:       "/buyers/investors",
  developer:   "/developer",
  testimonial: "/testimonial",
  insights:    "/insights",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PagesList() {
  // CMS pages state
  const [cmsPages, setCmsPages] = useState<CmsPage[]>([]);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsTogglingSlug, setCmsTogglingSlug] = useState<string | null>(null);
  const [cmsArchivingSlug, setCmsArchivingSlug] = useState<string | null>(null);
  const [editingDesc, setEditingDesc] = useState<string | null>(null);
  const [descDraft, setDescDraft] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);

  // Custom pages state
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  // Shared feedback
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function showMsg(msg: string) { setMessage(msg); setErrorMessage(""); }
  function showErr(err: string) { setErrorMessage(err); setMessage(""); }

  useEffect(() => {
    fetch("/api/admin/cms-pages")
      .then((r) => r.json())
      .then((data) => { setCmsPages(data); setCmsLoading(false); });

    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => { setPages(data); setLoading(false); });
  }, []);

  // ── CMS actions ───────────────────────────────────────────────────────────

  async function cmsTogglePublish(page: CmsPage) {
    setCmsTogglingSlug(page.slug);
    const res = await fetch(`/api/admin/cms-pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !page.published }),
    });
    setCmsTogglingSlug(null);
    if (res.ok) {
      setCmsPages((prev) =>
        prev.map((p) => p.slug === page.slug ? { ...p, published: !page.published } : p)
      );
      showMsg(page.published ? "Page unpublished." : "Page published.");
    } else {
      showErr("Failed to update page status.");
    }
  }

  async function cmsArchivePage(page: CmsPage) {
    if (!confirm(`Archive "${page.name}"? It will be hidden from this list and show a 404. You can restore it from Archived Pages.`)) return;
    setCmsArchivingSlug(page.slug);
    await fetch(`/api/admin/cms-pages/${page.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    setCmsArchivingSlug(null);
    setCmsPages((prev) => prev.filter((p) => p.slug !== page.slug));
    showMsg("Page archived.");
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
      setCmsPages((prev) =>
        prev.map((p) => p.slug === slug ? { ...p, description: descDraft } : p)
      );
      setEditingDesc(null);
    } else {
      showErr("Failed to save note.");
    }
  }

  // ── Custom page actions ───────────────────────────────────────────────────

  async function togglePublish(page: CustomPage) {
    const action = page.status === "published" ? "unpublish" : "publish";
    setTogglingId(page._id);
    const res = await fetch(`/api/admin/pages/${page._id}/${action}`, { method: "POST" });
    const data = await res.json();
    setTogglingId(null);
    if (res.ok) {
      showMsg(action === "publish" ? "Page published." : "Page unpublished.");
      setPages((prev) =>
        prev.map((p) => p._id === page._id
          ? { ...p, status: action === "publish" ? "published" : "draft" }
          : p
        )
      );
    } else {
      showErr(data.error || "Failed to update page.");
    }
  }

  async function archivePage(page: CustomPage) {
    if (!confirm(`Archive "${page.title}"? It will be hidden from this list and show a 404. You can restore it from Archived Pages.`)) return;
    setArchivingId(page._id);
    const res = await fetch(`/api/admin/pages/${page._id}/archive`, { method: "POST" });
    const data = await res.json();
    setArchivingId(null);
    if (res.ok) {
      showMsg("Page archived.");
      setPages((prev) => prev.filter((p) => p._id !== page._id));
    } else {
      showErr(data.error || "Failed to archive page.");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-neutral-700"
            >
              ← Dashboard
            </Link>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">PPM Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-neutral-900">Manage Pages</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Control the live status and content of all site pages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard/pages/archived"
              className="rounded border border-neutral-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-700"
            >
              Archived
            </Link>
            <Link
              href="/admin/dashboard/pages/new"
              className="rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
            >
              New Page
            </Link>
          </div>
        </div>

        {/* Feedback banners */}
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

        {/* ── Section: Site Pages ─────────────────────────────────────────── */}
        <div className="mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Site Pages
          </p>
          <p className="mt-0.5 text-[12px] text-neutral-400">
            Core pages built into the site. Edit their content inline then publish.
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {cmsLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Loading…</div>
          ) : cmsPages.length === 0 ? (
            <div className="py-16 text-center text-sm text-neutral-400">No site pages found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Page</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Admin Note</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Updated</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Status</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cmsPages.flatMap((page) => {
                  const rowClass = `transition ${!page.published ? "bg-neutral-50/80" : ""}`;

                  const statusCell = (
                    <td className="px-6 py-4">
                      {page.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          Hidden
                        </span>
                      )}
                    </td>
                  );

                  const sharedActions = (previewHref: string, editHref?: string) => (
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={previewHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded border border-neutral-200 px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
                        >
                          Preview ↗
                        </a>
                        {(editHref ?? CMS_EDIT_LINKS[page.slug]) && (
                          <Link
                            href={editHref ?? CMS_EDIT_LINKS[page.slug]}
                            className="rounded border border-[#5f5245] bg-[#2f2a24] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#1f1a17]"
                          >
                            Edit
                          </Link>
                        )}
                        <button
                          onClick={() => cmsTogglePublish(page)}
                          disabled={cmsTogglingSlug === page.slug}
                          className={`rounded px-3 py-1.5 text-[11px] font-medium transition disabled:opacity-50 ${
                            page.published
                              ? "border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {cmsTogglingSlug === page.slug ? "…" : page.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => cmsArchivePage(page)}
                          disabled={cmsArchivingSlug === page.slug}
                          className="rounded border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-medium text-orange-600 transition hover:bg-orange-100 disabled:opacity-50"
                        >
                          {cmsArchivingSlug === page.slug ? "…" : "Archive"}
                        </button>
                      </div>
                    </td>
                  );

                  const descCell = (
                    <td className="max-w-[200px] px-6 py-4">
                      {editingDesc === page.slug ? (
                        <div className="space-y-2">
                          <textarea
                            autoFocus
                            value={descDraft}
                            onChange={(e) => setDescDraft(e.target.value)}
                            rows={2}
                            className="w-full resize-none rounded border border-neutral-300 px-2 py-1.5 text-[12px] text-neutral-700 focus:border-amber-400 focus:outline-none"
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
                  );

                  // Buyers slug → two rows for Investors and Owner-Occupiers
                  if (page.slug === "buyer") {
                    return [
                      <tr key="buyer-investors" className={rowClass}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-900">Investors</p>
                          <p className="mt-1 text-[11px] text-neutral-400">/buyers/investors</p>
                        </td>
                        {descCell}
                        <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                          {formatDate(page.contentUpdatedAt)}
                        </td>
                        {statusCell}
                        {sharedActions("/buyers/investors", "/admin/dashboard/content/buyer/investors")}
                      </tr>,
                      <tr key="buyer-owner-occupiers" className={rowClass}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-900">Owner-Occupiers</p>
                          <p className="mt-1 text-[11px] text-neutral-400">/buyers/owner-occupiers</p>
                        </td>
                        {descCell}
                        <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                          {formatDate(page.contentUpdatedAt)}
                        </td>
                        {statusCell}
                        {sharedActions("/buyers/owner-occupiers", "/admin/dashboard/content/buyer/owner-occupiers")}
                      </tr>,
                    ];
                  }

                  // Default: single row
                  return [
                    <tr key={page.slug} className={rowClass}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-900">{page.name}</p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          /{page.slug === "landing" ? "" : page.slug}
                        </p>
                      </td>
                      {descCell}
                      <td className="whitespace-nowrap px-6 py-4 text-[12px] text-neutral-500">
                        {formatDate(page.contentUpdatedAt)}
                      </td>
                      {statusCell}
                      {sharedActions(CMS_PREVIEW_LINKS[page.slug] ?? `/${page.slug}`)}
                    </tr>,
                  ];
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Section: Custom Pages ───────────────────────────────────────── */}
        <div className="mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Custom Pages
          </p>
          <p className="mt-0.5 text-[12px] text-neutral-400">
            Pages created by admins using content templates.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Loading…</div>
          ) : pages.length === 0 ? (
            <div className="py-16 text-center text-sm text-neutral-400">
              No custom pages yet.{" "}
              <Link href="/admin/dashboard/pages/new" className="text-[#2f2a24] underline">
                Create your first page
              </Link>
              .
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Page</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Template</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Updated</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Status</th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pages.map((page) => (
                  <tr
                    key={page._id}
                    className={`transition ${page.status !== "published" ? "bg-neutral-50/80" : ""}`}
                  >
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
                      {page.status === "published" ? (
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
                        <a
                          href={`/more/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`rounded border px-3 py-1.5 text-[11px] font-medium transition ${
                            page.status === "published"
                              ? "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                              : "cursor-not-allowed border-neutral-200 text-neutral-300"
                          }`}
                          title={page.status !== "published" ? "Publish page to preview" : undefined}
                          onClick={page.status !== "published" ? (e) => e.preventDefault() : undefined}
                        >
                          Preview ↗
                        </a>
                        <Link
                          href={`/admin/dashboard/pages/${page._id}`}
                          className="rounded border border-[#5f5245] bg-[#2f2a24] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#1f1a17]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => togglePublish(page)}
                          disabled={togglingId === page._id}
                          className={`rounded px-3 py-1.5 text-[11px] font-medium transition disabled:opacity-50 ${
                            page.status === "published"
                              ? "border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {togglingId === page._id ? "…" : page.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => archivePage(page)}
                          disabled={archivingId === page._id}
                          className="rounded border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-medium text-orange-600 transition hover:bg-orange-100 disabled:opacity-50"
                        >
                          {archivingId === page._id ? "…" : "Archive"}
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
          Draft and hidden pages are not visible on the public site.
        </p>
      </div>
    </main>
  );
}
