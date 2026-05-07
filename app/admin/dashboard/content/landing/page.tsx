"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { landingDefaults, LandingContentData } from "@/lib/landing-defaults";

type Field = keyof LandingContentData;

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

const statGroups = [
  { vf: "stat1Value" as Field, uf: "stat1Unit" as Field, lf: "stat1Label" as Field },
  { vf: "stat2Value" as Field, uf: "stat2Unit" as Field, lf: "stat2Label" as Field },
  { vf: "stat3Value" as Field, uf: "stat3Unit" as Field, lf: "stat3Label" as Field },
];

const svcGroups = [
  { index: "01", lf: "svc1Label" as Field, sf: "svc1Sub" as Field, df: "svc1Desc" as Field, hasDesc: true },
  { index: "02", lf: "svc2Label" as Field, sf: "svc2Sub" as Field, df: "svc2Desc" as Field, hasDesc: true },
  { index: "03", lf: "svc3Label" as Field, sf: "svc3Sub" as Field, df: "svc3Desc" as Field, hasDesc: true },
  { index: "04", lf: "svc4Label" as Field, sf: "svc4Sub" as Field, df: "svc4Desc" as Field, hasDesc: true },
  { index: "05", lf: "svc5Label" as Field, sf: "svc5Sub" as Field, df: "svc5Desc" as Field, hasDesc: true },
  { index: "06", lf: "svc6Label" as Field, sf: "svc6Sub" as Field, df: null,               hasDesc: false },
];

export default function LandingInlineEditor() {
  const [content, setContent] = useState<LandingContentData>(landingDefaults);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  useEffect(() => {
    fetch("/api/admin/content/landing")
      .then((r) => r.json())
      .then((data) => {
        setContent((prev) => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, []);

  function r(field: Field) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  async function confirmRevert() {
    setRevertOpen(false);
    for (const [field, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el && field in landingDefaults) {
        el.innerText = landingDefaults[field as keyof typeof landingDefaults] as string;
      }
    }
    setContent(landingDefaults);
    setSaved(false);
    await fetch("/api/admin/content/landing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(landingDefaults),
    });
  }

  async function save() {
    const updates: Partial<Record<Field, string>> = {};
    for (const [key, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el) updates[key] = el.innerText.trim();
    }
    setSaving(true);
    const res = await fetch("/api/admin/content/landing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    if (res.ok) {
      setContent((prev) => ({ ...prev, ...updates } as LandingContentData));
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  const c = content;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

  return (
    <>
      {/* ── Admin toolbar ───────────────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 hover:text-black transition">
            ← Dashboard
          </Link>
          <span className="text-black/20">|</span>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-black">
              Edit Mode — Home
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-black/50">· Click any underlined text to edit</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-black/70">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
              </svg>
              Saved
            </span>
          )}
          <a
            href="/"
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

      {/* ── Page render (editable) ───────────────────────────────────────────── */}
      <main className="min-h-screen w-full pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative min-h-[88vh] bg-[#0a0806] flex flex-col justify-center overflow-hidden">
          <EditBadge />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24 flex flex-col justify-center">
            <p
              ref={r("heroTagline")}
              contentEditable
              suppressContentEditableWarning
              className={`text-[10px] uppercase tracking-[0.38em] text-[#8a7b6d] mb-6 ${EDIT_DARK}`}
            >
              {c.heroTagline}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.08] text-white max-w-3xl">
              <span ref={r("heroLine1")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                {c.heroLine1}
              </span>
              <br />
              <em className="italic text-[#c8a96e]">
                <span ref={r("heroAccent")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                  {c.heroAccent}
                </span>
              </em>
              <br />
              <span ref={r("heroLine3")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                {c.heroLine3}
              </span>
            </h1>
            <p
              ref={r("heroSubtext")}
              contentEditable
              suppressContentEditableWarning
              className={`mt-8 max-w-[42ch] text-[13.5px] leading-[1.9] text-[#9e8d7a] ${EDIT_DARK}`}
            >
              {c.heroSubtext}
            </p>
          </div>
        </section>

        {/* S2: Stats Strip */}
        <section className="relative bg-[#1c1814] border-b border-white/[0.06]">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid grid-cols-1 divide-y divide-white/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0">
              {statGroups.map(({ vf, uf, lf }) => (
                <div key={vf} className="flex flex-col justify-center px-10 py-12">
                  <p className="text-[2.6rem] font-light leading-none text-white">
                    <span ref={r(vf)} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                      {c[vf]}
                    </span>
                    {c[uf] !== "" && (
                      <span ref={r(uf)} contentEditable suppressContentEditableWarning className={`ml-1 text-[1.4rem] text-[#c8a96e] ${EDIT_DARK}`}>
                        {c[uf]}
                      </span>
                    )}
                  </p>
                  <p
                    ref={r(lf)}
                    contentEditable
                    suppressContentEditableWarning
                    className={`mt-3 text-[10px] uppercase tracking-[0.26em] text-[#6b5e54] ${EDIT_DARK}`}
                  >
                    {c[lf]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S3: Services Grid */}
        <section className="relative bg-[#2f2a24] py-20 px-8">
          <EditBadge />
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-center gap-8">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54] shrink-0">Explore</p>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {svcGroups.map(({ index, lf, sf, df, hasDesc }) => (
                <div key={index} className="border border-white/[0.07] bg-[#1c1814] flex flex-col p-7">
                  <span className="text-[9px] uppercase tracking-[0.28em] mb-5 text-[#3d3530]">{index}</span>
                  <p
                    ref={r(lf)}
                    contentEditable
                    suppressContentEditableWarning
                    className={`text-[1.9rem] font-light leading-none mb-2 text-neutral-200 ${EDIT_DARK}`}
                  >
                    {c[lf]}
                  </p>
                  <p
                    ref={r(sf)}
                    contentEditable
                    suppressContentEditableWarning
                    className={`text-[10px] uppercase tracking-[0.18em] mb-4 text-[#6b5e54] ${EDIT_DARK}`}
                  >
                    {c[sf]}
                  </p>
                  {hasDesc && df && (
                    <p
                      ref={r(df)}
                      contentEditable
                      suppressContentEditableWarning
                      className={`text-[12.5px] leading-[1.85] text-[#5a4f47] ${EDIT_DARK}`}
                    >
                      {c[df]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S4: Ethos */}
        <section className="relative bg-[#f6f2eb] py-36 px-8">
          <EditBadge />
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-[1fr_2fr] gap-16 md:items-start">
              <div className="md:pt-3">
                <div className="h-px w-12 bg-[#c8a96e] mb-6" />
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Our Ethos</p>
              </div>
              <div>
                <h2
                  ref={r("ethosHeading")}
                  contentEditable
                  suppressContentEditableWarning
                  className={`text-4xl md:text-5xl lg:text-[3.4rem] font-light leading-[1.2] text-[#1f1a17] ${EDIT_LIGHT}`}
                >
                  {c.ethosHeading}
                </h2>
                <p
                  ref={r("ethosBody")}
                  contentEditable
                  suppressContentEditableWarning
                  className={`mt-8 max-w-[55ch] text-[13.5px] leading-[2] text-[#5a4a3f] ${EDIT_LIGHT}`}
                >
                  {c.ethosBody}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* S5: CTA */}
        <section className="relative bg-[#1c1814] border-t border-white/[0.06] py-28 px-8">
          <EditBadge />
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#6b5e54] mb-6">Ready to begin?</p>
            <h2
              ref={r("ctaHeading")}
              contentEditable
              suppressContentEditableWarning
              className={`text-4xl md:text-5xl font-light text-neutral-100 leading-snug mb-10 ${EDIT_DARK}`}
            >
              {c.ctaHeading}
            </h2>
          </div>
        </section>

      </main>

      {/* Revert confirmation modal */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Revert to default</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will reset all text back to the original defaults and overwrite any saved changes. This cannot be undone.
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
