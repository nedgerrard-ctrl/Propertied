"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TemplateKey = "text-only" | "text-image";

function makeSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewPageScreen() {
  const router = useRouter();
  const [templateKey, setTemplateKey] = useState<TemplateKey>("text-only");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(makeSlug(value));
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value);
  }

  async function handleCreate() {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), slug: slug.trim(), templateKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create page.");
        return;
      }
      router.push(`/admin/dashboard/pages/${data._id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/admin/dashboard/pages"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-neutral-700"
          >
            ← Manage Pages
          </Link>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">
            PPM Admin
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-neutral-900">
            New Page
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Choose a template, set a title and URL slug, then edit the content
            inline.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          {/* Template selector */}
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Template
          </p>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                {
                  key: "text-only" as const,
                  label: "Text Only",
                  desc: "Dark hero, body paragraphs, CTA section.",
                },
                {
                  key: "text-image" as const,
                  label: "Text + Image",
                  desc: "Alternating sections with a paragraph and an image side by side.",
                },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTemplateKey(t.key)}
                className={`rounded-lg border-2 p-5 text-left transition ${
                  templateKey === t.key
                    ? "border-[#2f2a24] bg-[#f5f1eb]"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <p className="text-[13px] font-semibold text-neutral-900">
                  {t.label}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
                  {t.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="mt-7">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. What is Project Management?"
              className="w-full rounded border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-[14px] text-neutral-900 outline-none focus:border-[#2f2a24] focus:bg-white"
            />
          </div>

          {/* Slug */}
          <div className="mt-5">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              URL Slug
            </label>
            <div className="flex items-center overflow-hidden rounded border border-neutral-300 bg-neutral-50 focus-within:border-[#2f2a24] focus-within:bg-white">
              <span className="select-none border-r border-neutral-300 bg-neutral-100 px-3 py-2.5 text-[12px] text-neutral-400">
                /more/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="what-is-project-management"
                className="flex-1 bg-transparent px-3 py-2.5 text-[14px] text-neutral-900 outline-none"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          {error && (
            <p className="mt-4 text-[12px] font-medium text-red-600">{error}</p>
          )}

          <div className="mt-8 flex items-center justify-end gap-3">
            <Link
              href="/admin/dashboard/pages"
              className="px-5 py-2.5 text-[12px] font-semibold text-neutral-500 transition hover:text-neutral-800"
            >
              Cancel
            </Link>
            <button
              onClick={handleCreate}
              disabled={creating || !title.trim() || !slug.trim()}
              className="bg-[#2f2a24] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17] disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create Page"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
