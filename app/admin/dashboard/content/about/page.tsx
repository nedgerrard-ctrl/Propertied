"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { aboutDefaults, AboutContentData } from "@/lib/about-defaults";
import ThreadsBackground from "@/app/about/ThreadsBackground";

type Field = keyof AboutContentData;

const EDIT_LIGHT = "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK  = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

function EditBadge() {
  return (
    <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black shadow select-none z-20">
      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
      </svg>
      Editable
    </span>
  );
}

export default function AboutInlineEditor() {
  const [content, setContent] = useState<AboutContentData>(aboutDefaults);
  const [lastSaved, setLastSaved] = useState<AboutContentData>(aboutDefaults);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  useEffect(() => {
    fetch("/api/admin/content/about")
      .then((r) => r.json())
      .then((data) => {
        setContent((prev) => ({ ...prev, ...data }));
        setLastSaved((prev) => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, []);

  function r(field: Field) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  async function confirmRevert() {
    setRevertOpen(false);

    for (const [field, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el && field in lastSaved) {
        el.innerText = lastSaved[field as keyof typeof lastSaved];
      }
    }

    setContent(lastSaved);
    setSaved(false);
  }

  async function save() {
    // Read DOM values BEFORE any state update triggers a re-render
    const updates: Partial<Record<Field, string>> = {};
    for (const [key, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el) updates[key] = el.innerText.trim();
    }

    setSaving(true);
    const res = await fetch("/api/admin/content/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);

    if (res.ok) {
      // Sync content state with what we just saved so React's next re-render
      // sees the same values as the DOM and does not reset contentEditable elements
      setContent((prev) => ({ ...prev, ...updates } as AboutContentData));
      setLastSaved((prev) => ({ ...prev, ...updates } as AboutContentData));
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  const c = content;

  const eras = [
    { yearField: "era1Year" as Field, headingField: "era1Heading" as Field, bodyFields: ["era1Body" as Field] },
    { yearField: "era2Year" as Field, headingField: "era2Heading" as Field, bodyFields: ["era2Body" as Field] },
    { yearField: "era3Year" as Field, headingField: "era3Heading" as Field, bodyFields: ["era3Body1" as Field, "era3Body2" as Field] },
  ];

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

  return (
    <>
      {/* ── Admin toolbar ─────────────────────────────────────────────────── */}
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
              Edit Mode — About Us
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-black/50">· Click any underlined text to edit</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-black/70">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
              Saved
            </span>
          )}
          <a
            href="/about"
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
            Discard Changes
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

      {/* ── Page render (editable) ─────────────────────────────────────────── */}
      {/* [&_a]:pointer-events-none disables all link navigation inside the editable area */}
      <main className="min-h-screen w-full text-[#1f1a17] pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
          <EditBadge />
          <div className="absolute inset-0 z-0">
            <ThreadsBackground />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Who We Are</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Est. 2013</p>
            </div>
            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
                <span ref={r("heroHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                  {c.heroHeadingMain}
                </span>{" "}
                <span ref={r("heroHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>
                  {c.heroHeadingAccent}
                </span>
              </h1>
            </div>
            <div className="mt-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
              <span className="block h-px w-10 bg-[#3a302a]" />
              <span>Our Story</span>
            </div>
          </div>
        </section>

        {/* S2: Timeline */}
        <section className="relative bg-white py-20 lg:py-28">
          <EditBadge />
          <div className="mx-auto max-w-2xl px-8">
            {eras.map(({ yearField, headingField, bodyFields }) => (
              <div key={yearField} className="mb-14 last:mb-0">
                <p className="text-2xl font-semibold text-[#c8a96e] mb-3">
                  <span ref={r(yearField)} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c[yearField]}</span>
                </p>
                <h2 className="text-[1.35rem] font-bold text-[#1f1a17] leading-snug mb-3">
                  <span ref={r(headingField)} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c[headingField]}</span>
                </h2>
                <div className="space-y-3">
                  {bodyFields.map((field) => (
                    <p key={field} ref={r(field)} contentEditable suppressContentEditableWarning className={`text-[14px] leading-[1.85] text-[#3d3530] ${EDIT_LIGHT}`}>
                      {c[field]}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
              <span className="text-[13px] text-[#1f1a17] opacity-50 cursor-default">→ Meet our people</span>
              <span className="text-[13px] text-[#1f1a17] opacity-50 cursor-default">→ How we work for buyers</span>
            </div>
          </div>
        </section>

        {/* Footer line */}
        <div className="border-t border-[#ede8e1] py-5">
          <p className="text-center text-[11px] text-[#8a7b6d]">
            PPM · Property Project Marketing · www.onlineprojects.com.au
          </p>
        </div>

      </main>

      {/* Revert confirmation modal */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">
              Discard changes
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will undo all unsaved edits and restore the page to the last saved state. Any changes made since your last save will be lost.
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
