"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { blogPageDefaults, BlogPageContentData } from "@/lib/blog-page-defaults";

// ── Style constants ────────────────────────────────────────────────────────────
const EDIT_DARK =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

type Field = keyof BlogPageContentData;

// ── Main editor ────────────────────────────────────────────────────────────────
export default function BlogInlineEditor() {
  const [content, setContent]     = useState<BlogPageContentData>(blogPageDefaults);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);

  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  function r(field: Field) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  useEffect(() => {
    fetch("/api/admin/content/blog")
      .then((res) => res.json())
      .then((data: BlogPageContentData) => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  // ── Save ───────────────────────────────────────────────────────────────────
  async function save() {
    const fields: Field[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    const updates: Partial<BlogPageContentData> = {};
    for (const f of fields) {
      updates[f] = refs.current[f]?.innerText.trim() || content[f];
    }

    setSaving(true);
    const res = await fetch("/api/admin/content/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    if (res.ok) {
      setContent(updates as BlogPageContentData);
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  // ── Revert ─────────────────────────────────────────────────────────────────
  async function confirmRevert() {
    setRevertOpen(false);
    const fields: Field[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    for (const f of fields) {
      const el = refs.current[f];
      if (el) el.innerText = blogPageDefaults[f];
    }
    setContent(blogPageDefaults);
    setSaved(false);
    await fetch("/api/admin/content/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogPageDefaults),
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  return (
    <>
      {/* ── Admin toolbar ──────────────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 hover:text-black transition"
          >
            ← Dashboard
          </Link>
          <span className="text-black/20">|</span>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-black">
              Edit Mode — Blog
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-black/70">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              Saved
            </span>
          )}
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70 transition hover:border-black/60 hover:text-black"
          >
            Preview ↗
          </a>
          <button
            onClick={() => setRevertOpen(true)}
            className="border border-black/30 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/60 transition hover:border-black/60 hover:text-black"
          >
            Revert to Default
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="bg-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400 transition hover:bg-black/80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="pt-[48px]">
        {/* ── Hero preview (dark, contentEditable) ──────────────────────── */}
        <section className="relative min-h-[72vh] bg-[#0a0806] flex flex-col justify-end overflow-hidden [&_a]:pointer-events-none [&_a]:cursor-default">
          {/* Editable badge */}
          <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black shadow select-none z-20">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            Editable
          </span>

          {/* Decorative particle-wave placeholder */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#2d2218]">
              Particle wave renders on the live page
            </p>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pb-16 pt-32">
            <div className="border-b border-[#2d2218] pb-7 flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">PPM Insights</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Articles</p>
            </div>

            <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.0] text-white">
                <span
                  ref={r("heroHeadingMain")}
                  contentEditable
                  suppressContentEditableWarning
                  className={EDIT_DARK}
                  onInput={() => setSaved(false)}
                >
                  {content.heroHeadingMain}
                </span>
                &nbsp;
                <em className={`not-italic text-[#c8a96e] ${EDIT_DARK}`}>
                  <span
                    ref={r("heroHeadingAccent")}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => setSaved(false)}
                  >
                    {content.heroHeadingAccent}
                  </span>
                </em>
              </h1>
              <p
                ref={r("heroSubtext")}
                contentEditable
                suppressContentEditableWarning
                className={`md:max-w-[28ch] text-[13px] leading-[1.9] text-[#8a7b6d] md:pb-2 ${EDIT_DARK}`}
                onInput={() => setSaved(false)}
              >
                {content.heroSubtext}
              </p>
            </div>
          </div>
        </section>

        {/* ── Info panel ──────────────────────────────────────────────────── */}
        <section className="bg-neutral-100 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="text-[13px] font-semibold text-neutral-800">
                Blog Posts — Managed Separately
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">
                Individual blog posts (title, content, images, publish status) are managed in the
                <strong className="font-semibold text-neutral-700"> Blogs</strong> section of the
                admin dashboard. This editor only controls the hero heading and subtext shown at
                the top of the <code className="rounded bg-neutral-100 px-1 text-[11px]">/blog</code> listing page.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/admin/dashboard/blogs"
                  className="inline-flex items-center gap-1.5 rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
                >
                  Manage Blog Posts →
                </Link>
                <Link
                  href="/admin/dashboard/blogs/new"
                  className="inline-flex items-center gap-1.5 rounded border border-neutral-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-500 hover:text-neutral-800"
                >
                  + New Blog Post
                </Link>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
              <strong>Tip:</strong> Click any text in the dark hero above to edit it inline.
              Hit <strong>Save Changes</strong> in the toolbar when done.
            </div>
          </div>
        </section>
      </div>

      {/* ── Revert modal ────────────────────────────────────────────────── */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Revert to default</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will reset the hero heading and subtext back to their original default values.
              Blog posts are not affected.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRevertOpen(false)}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRevert}
                className="rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
