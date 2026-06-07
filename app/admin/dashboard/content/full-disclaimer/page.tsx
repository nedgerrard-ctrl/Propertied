"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fullDisclaimerDefaults, FullDisclaimerContentData } from "@/lib/full-disclaimer-defaults";
import { disclaimerSections, DisclaimerSection, defaultSectionFields, resolveText } from "@/lib/full-disclaimer-sections";

type HeroField = "heroHeadingMain" | "heroHeadingAccent" | "heroSubtext";

const EDIT_DARK  = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";
const EDIT_LIGHT = "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";

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

// ── Editable section block ─────────────────────────────────────────────────────

function EditableSectionBlock({
  section,
  overrides,
  sectionRefs,
}: {
  section: DisclaimerSection
  overrides: Record<string, string>
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
}) {
  const n = section.number
  const t = (key: string, def: string) => resolveText(key, overrides, def)

  function ref(key: string) {
    return (el: HTMLElement | null) => { sectionRefs.current[key] = el }
  }

  const body = (() => {
    if (section.type === 'paragraphs') {
      return (
        <div className="space-y-4">
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              ref={ref(`s${n}p${i}`)}
              contentEditable
              suppressContentEditableWarning
              className={`text-[14px] leading-[1.9] text-[#3d3530] ${EDIT_LIGHT}`}
            >
              {t(`s${n}p${i}`, p)}
            </p>
          ))}
        </div>
      )
    }

    if (section.type === 'mixed') {
      return (
        <div className="space-y-4">
          {section.blocks.map((block, bi) => {
            if (block.kind === 'paragraph') {
              return (
                <p
                  key={bi}
                  ref={ref(`s${n}k${bi}`)}
                  contentEditable
                  suppressContentEditableWarning
                  className={`text-[14px] leading-[1.9] text-[#3d3530] ${EDIT_LIGHT}`}
                >
                  {t(`s${n}k${bi}`, block.text)}
                </p>
              )
            }
            return (
              <div key={bi} className="space-y-2">
                {block.intro && (
                  <p
                    ref={ref(`s${n}k${bi}i`)}
                    contentEditable
                    suppressContentEditableWarning
                    className={`text-[14px] leading-[1.9] text-[#3d3530] ${EDIT_LIGHT}`}
                  >
                    {t(`s${n}k${bi}i`, block.intro)}
                  </p>
                )}
                <ul className="space-y-2 pl-4">
                  {block.bullets.map((b, bui) => (
                    <li key={bui} className="flex gap-3 text-[14px] leading-[1.9] text-[#3d3530]">
                      <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                      <span
                        ref={ref(`s${n}k${bi}b${bui}`)}
                        contentEditable
                        suppressContentEditableWarning
                        className={`flex-1 ${EDIT_LIGHT}`}
                      >
                        {t(`s${n}k${bi}b${bui}`, b)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )
    }

    if (section.type === 'contact') {
      return (
        <div className="space-y-4">
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              ref={ref(`s${n}p${i}`)}
              contentEditable
              suppressContentEditableWarning
              className={`text-[14px] leading-[1.9] text-[#3d3530] ${EDIT_LIGHT}`}
            >
              {t(`s${n}p${i}`, p)}
            </p>
          ))}
          <div className="border-l-2 border-[#c8a96e] pl-5 space-y-1">
            {section.details.map((d, i) => (
              <p
                key={i}
                ref={ref(`s${n}d${i}`)}
                contentEditable
                suppressContentEditableWarning
                className={`text-[13px] leading-[1.8] text-[#1f1a17] ${EDIT_LIGHT}`}
              >
                {t(`s${n}d${i}`, d)}
              </p>
            ))}
          </div>
        </div>
      )
    }

    return null
  })()

  return (
    <div className="py-8 border-t border-[#ede8e1] first:border-t-0 first:pt-0">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c8a96e] mb-4">
        {section.number}. {section.heading}
      </h2>
      {body}
    </div>
  )
}

// ── Main editor ───────────────────────────────────────────────────────────────

export default function FullDisclaimerInlineEditor() {
  const [content, setContent] = useState<FullDisclaimerContentData>(fullDisclaimerDefaults);
  const [lastSaved, setLastSaved] = useState<FullDisclaimerContentData>(fullDisclaimerDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);

  const heroRefs = useRef<Partial<Record<HeroField, HTMLElement | null>>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    fetch("/api/admin/content/full-disclaimer")
      .then((r) => r.json())
      .then((data) => {
        setContent((prev) => ({ ...prev, ...data }));
        setLastSaved((prev) => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, []);

  function rh(field: HeroField) {
    return (el: HTMLElement | null) => { heroRefs.current[field] = el; };
  }

  async function confirmRevert() {
    setRevertOpen(false);
    const heroFields: HeroField[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    for (const f of heroFields) {
      const el = heroRefs.current[f];
      if (el) el.innerText = lastSaved[f] as string;
    }
    const defaults = defaultSectionFields();
    const savedOverrides = lastSaved.sectionOverrides ?? {};
    for (const [key, el] of Object.entries(sectionRefs.current)) {
      if (el) el.innerText = resolveText(key, savedOverrides, defaults[key] ?? "");
    }
    setContent(lastSaved);
    setSaved(false);
  }

  async function save() {
    const heroFields: HeroField[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    const heroUpdates: Partial<Record<HeroField, string>> = {};
    for (const f of heroFields) {
      const el = heroRefs.current[f];
      if (el) heroUpdates[f] = el.innerText.trim();
    }

    const sectionOverrides: Record<string, string> = {};
    for (const [key, el] of Object.entries(sectionRefs.current)) {
      if (el) sectionOverrides[key] = el.innerText.trim();
    }

    setSaving(true);
    const res = await fetch("/api/admin/content/full-disclaimer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...heroUpdates, sectionOverrides }),
    });
    setSaving(false);
    if (res.ok) {
      setContent((prev) => ({ ...prev, ...heroUpdates, sectionOverrides }));
      setLastSaved((prev) => ({ ...prev, ...heroUpdates, sectionOverrides }));
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  const c = content;
  const overrides = c.sectionOverrides ?? {};

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
              Edit Mode — Full Disclaimer
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-black/50">
            · Click any underlined text to edit
          </span>
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
            href="/full-disclaimer"
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

      {/* ── Page preview (editable) ─────────────────────────────────────────── */}
      <main className="min-h-screen w-full text-[#1f1a17] pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
          <EditBadge />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Legal</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Disclosures</p>
            </div>
            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
                <span ref={rh("heroHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                  {c.heroHeadingMain}
                </span>
                <br />
                <span ref={rh("heroHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>
                  {c.heroHeadingAccent}
                </span>
              </h1>
            </div>
            <p ref={rh("heroSubtext")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
              {c.heroSubtext}
            </p>
          </div>
        </section>

        {/* S2: Document header — static metadata */}
        <section className="bg-[#f6f2eb] border-b border-[#e3d8ca] py-10">
          <div className="mx-auto max-w-3xl px-8">
            <p className="text-[13px] font-semibold text-[#1f1a17]">Full Website Disclaimer</p>
            <p className="mt-1 text-[12px] text-[#8a7b6d]">Effective date: 1 July 2026</p>
            <p className="mt-0.5 text-[12px] text-[#8a7b6d]">
              Published at www.ppmproperty.com.au/disclaimer and linked from every footer.
            </p>
          </div>
        </section>

        {/* S3: All 20 sections — fully editable */}
        <section className="relative bg-white py-20 lg:py-28">
          <EditBadge />
          <div className="mx-auto max-w-3xl px-8">
            <div>
              {disclaimerSections.map((section) => (
                <EditableSectionBlock
                  key={section.number}
                  section={section}
                  overrides={overrides}
                  sectionRefs={sectionRefs}
                />
              ))}
            </div>
            <div className="mt-12 border-t border-[#ede8e1] pt-8">
              <p className="text-[12px] text-[#8a7b6d]">
                © 2026 Property Project Marketing Pty Ltd. All rights reserved.
              </p>
            </div>
            <div className="mt-8 border-t border-[#ede8e1] pt-6 text-center">
              <p className="text-[11px] tracking-[0.18em] text-[#b0a090]">
                PPM · Property Project Marketing · www.onlineprojects.com.au
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Revert confirmation modal */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Discard changes</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will undo all unsaved edits and restore the page to the last saved state.
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
