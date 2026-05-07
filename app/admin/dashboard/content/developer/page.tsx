"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { developerDefaults, DeveloperContentData } from "@/lib/developer-defaults";

type Field = keyof DeveloperContentData;

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

export default function DeveloperInlineEditor() {
  const [content, setContent] = useState<DeveloperContentData>(developerDefaults);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  useEffect(() => {
    fetch("/api/admin/content/developer")
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
      if (el && field in developerDefaults) {
        el.innerText = developerDefaults[field as keyof typeof developerDefaults] as string;
      }
    }

    setContent(developerDefaults);
    setSaved(false);

    await fetch("/api/admin/content/developer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(developerDefaults),
    });
  }

  async function save() {
    const updates: Partial<Record<Field, string>> = {};
    for (const [key, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el) updates[key] = el.innerText.trim();
    }

    setSaving(true);
    const res = await fetch("/api/admin/content/developer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);

    if (res.ok) {
      setContent((prev) => ({ ...prev, ...updates } as DeveloperContentData));
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  const c = content;

  const partnershipBenefits = [
    { titleField: "benefit1Title" as Field, descField: "benefit1Desc" as Field },
    { titleField: "benefit2Title" as Field, descField: "benefit2Desc" as Field },
    { titleField: "benefit3Title" as Field, descField: "benefit3Desc" as Field },
  ];

  const processSteps = [
    { step: "01", titleField: "process1Title" as Field, descField: "process1Desc" as Field },
    { step: "02", titleField: "process2Title" as Field, descField: "process2Desc" as Field },
    { step: "03", titleField: "process3Title" as Field, descField: "process3Desc" as Field },
  ];

  const networkBulletFields = [
    "networkBullet1" as Field,
    "networkBullet2" as Field,
    "networkBullet3" as Field,
    "networkBullet4" as Field,
  ];

  const lifecycleFields = [
    "lifecycle1" as Field,
    "lifecycle2" as Field,
    "lifecycle3" as Field,
    "lifecycle4" as Field,
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
              Edit Mode — Developer
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
            href="/developer"
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

      {/* ── Page render (editable) ─────────────────────────────────────────── */}
      <main className="min-h-screen w-full text-[#1f1a17] pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
          <EditBadge />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">For Developers</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Partnership</p>
            </div>
            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
                <span ref={r("heroHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                  {c.heroHeadingMain}
                </span>
                <br />
                <span ref={r("heroHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>
                  {c.heroHeadingAccent}
                </span>
              </h1>
            </div>
            <p ref={r("heroSubtext")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-[48ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
              {c.heroSubtext}
            </p>
            <div className="mt-12 flex flex-wrap gap-5">
              <span className="inline-flex items-center border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] opacity-50 select-none cursor-default">
                Partner With Us
              </span>
              <span className="inline-flex items-center border border-[#3a302a] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] opacity-50 select-none cursor-default">
                About PPM
              </span>
            </div>
            <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
              <span className="block h-px w-10 bg-[#3a302a]" />
              <span>Our Approach</span>
            </div>
          </div>
        </section>

        {/* S2: Network section */}
        <section className="relative bg-[#1e1a15] overflow-hidden">
          <EditBadge />
          <div className="mx-auto max-w-7xl">
            <div className="grid min-h-[540px] lg:grid-cols-2">
              <div className="flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-16">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#9e8d7a]">
                  The PPM Difference
                </p>
                <h2 className="mt-4 text-[26px] font-light leading-[1.35] text-white sm:text-[30px]">
                  <span ref={r("networkHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.networkHeadingMain}</span>{" "}
                  <span ref={r("networkHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>{c.networkHeadingAccent}</span>
                </h2>
                <p ref={r("networkP1")} contentEditable suppressContentEditableWarning className={`mt-5 max-w-[42ch] text-[13px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
                  {c.networkP1}
                </p>
                <p ref={r("networkP2")} contentEditable suppressContentEditableWarning className={`mt-4 max-w-[42ch] text-[13px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
                  {c.networkP2}
                </p>
                <div className="mt-10 grid grid-cols-1 gap-px border border-[#2d2218] bg-[#2d2218]">
                  {networkBulletFields.map((field) => (
                    <div key={field} className="flex items-start gap-3 bg-[#1a1410] px-4 py-4">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                      <p ref={r(field)} contentEditable suppressContentEditableWarning className={`text-[12px] leading-[1.75] text-[#8a7b6d] ${EDIT_DARK}`}>
                        {c[field]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[380px] bg-[#1e1a15] lg:min-h-0 flex items-center justify-center">
                <p className="text-[11px] text-[#3d3028] uppercase tracking-[0.2em] select-none">
                  [Three.js Network Canvas — preview only]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* S3: Why Partner */}
        <section className="relative bg-white py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">Why Partner With PPM</p>
              <h2 ref={r("partnerHeading")} contentEditable suppressContentEditableWarning className={`text-2xl lg:text-3xl font-light text-[#1f1a17] ${EDIT_LIGHT}`}>
                {c.partnerHeading}
              </h2>
            </div>
            <div className="grid gap-px bg-[#f0ebe4] sm:grid-cols-3">
              {partnershipBenefits.map(({ titleField, descField }) => (
                <div key={titleField} className="bg-white p-10">
                  <h3 ref={r(titleField)} contentEditable suppressContentEditableWarning className={`text-[16px] font-semibold text-[#1f1a17] leading-snug ${EDIT_LIGHT}`}>
                    {c[titleField]}
                  </h3>
                  <div className="mt-4 w-6 border-t border-[#ddd3c6]" />
                  <p ref={r(descField)} contentEditable suppressContentEditableWarning className={`mt-5 text-[13px] leading-[1.85] text-[#5b5147] ${EDIT_LIGHT}`}>
                    {c[descField]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S4: Process */}
        <section className="relative bg-[#f6f2eb] py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">Process</p>
              <h2 ref={r("processHeading")} contentEditable suppressContentEditableWarning className={`text-2xl lg:text-3xl font-light text-[#1f1a17] ${EDIT_LIGHT}`}>
                {c.processHeading}
              </h2>
            </div>
            <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14">
              {processSteps.map(({ step, titleField, descField }) => (
                <div key={step} className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_10rem_1fr] gap-x-6 lg:gap-x-10 gap-y-1 py-9 border-b border-[#e8e2da] last:border-b-0">
                  <p className="text-[2.6rem] font-thin text-[#e0d8d0] tabular-nums leading-none select-none row-span-2 lg:row-span-1 self-center">{step}</p>
                  <p ref={r(titleField)} contentEditable suppressContentEditableWarning className={`text-[15px] font-semibold text-[#1f1a17] self-center ${EDIT_LIGHT}`}>
                    {c[titleField]}
                  </p>
                  <p ref={r(descField)} contentEditable suppressContentEditableWarning className={`col-start-2 lg:col-start-3 text-[13px] leading-[1.85] text-[#5b5147] max-w-[52ch] ${EDIT_LIGHT}`}>
                    {c[descField]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S5: End-to-End Model */}
        <section className="relative bg-white py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 lg:items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d] mb-6">End-to-End Model</p>
                <h2 ref={r("endToEndHeading")} contentEditable suppressContentEditableWarning className={`text-3xl lg:text-[2.75rem] font-light leading-[1.2] text-[#1f1a17] ${EDIT_LIGHT}`}>
                  {c.endToEndHeading}
                </h2>
                <div className="mt-8 space-y-5 text-[13px] leading-[1.9] text-[#5b5147]">
                  <p ref={r("endToEndP1")} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c.endToEndP1}</p>
                  <p ref={r("endToEndP2")} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c.endToEndP2}</p>
                </div>
              </div>
              <div className="border border-[#e3d8ca] bg-[#fbf8f3] p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7b6d]">The Lifecycle</p>
                <div className="mt-8 space-y-6">
                  {lifecycleFields.map((field, i) => (
                    <div key={field} className="flex items-start gap-5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd3c6] text-[11px] font-semibold text-[#2f2a24]">
                        {i + 1}
                      </div>
                      <p ref={r(field)} contentEditable suppressContentEditableWarning className={`pt-1 text-[13px] leading-6 text-[#5b5147] ${EDIT_LIGHT}`}>
                        {c[field]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S6: CTA */}
        <section className="relative bg-[#1c1814] py-32 lg:py-44">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#4a3f37]">Work With PPM</p>
            <h2 ref={r("ctaHeading")} contentEditable suppressContentEditableWarning className={`mt-6 text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.06] whitespace-pre-line ${EDIT_DARK}`}>
              {c.ctaHeading}
            </h2>
            <p ref={r("ctaSubtext")} contentEditable suppressContentEditableWarning className={`mt-6 text-[14px] text-[#8a7b6d] max-w-[40ch] mx-auto leading-[1.9] ${EDIT_DARK}`}>
              {c.ctaSubtext}
            </p>
          </div>
        </section>

      </main>

      {/* Revert confirmation modal */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">
              Revert to default
            </h2>
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
