"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { landingDefaults, LandingContentData } from "@/lib/landing-defaults";

// ─── Types ────────────────────────────────────────────────────────────────────

type Field = keyof LandingContentData;

type ToastData = { type: "success" | "error"; message: string } | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const EDIT_LIGHT = "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK  = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

const statGroups = [
  { vf: "stat1Value" as Field, uf: "stat1Unit" as Field, lf: "stat1Label" as Field },
  { vf: "stat2Value" as Field, uf: "stat2Unit" as Field, lf: "stat2Label" as Field },
  { vf: "stat3Value" as Field, uf: "stat3Unit" as Field, lf: "stat3Label" as Field },
];


// ─── Shared sub-components ────────────────────────────────────────────────────

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

function Toast({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-20 left-1/2 z-[300] -translate-x-1/2 flex w-full max-w-sm items-center gap-3 rounded-xl px-5 py-4 shadow-2xl ${toast.type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}>
      {toast.type === "success" ? (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <p className="flex-1 text-sm font-semibold">{toast.message}</p>
      <button onClick={onClose} className="text-white/70 hover:text-white transition text-xl leading-none">×</button>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

export default function LandingInlineEditor() {
  // ── Text content state ──
  const [content, setContent]     = useState<LandingContentData>(landingDefaults);
  const [lastSaved, setLastSaved] = useState<LandingContentData>(landingDefaults);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  const [toast, setToast] = useState<ToastData>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(type: "success" | "error", message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    fetch("/api/admin/content/landing")
      .then((r) => r.json())
      .then((cmsData) => {
        setContent((prev) => ({ ...prev, ...cmsData }));
        setLastSaved((prev) => ({ ...prev, ...cmsData }));
        setLoading(false);
      });
  }, []);

  function r(field: Field) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  // ── Text content save/revert ──
  async function confirmRevert() {
    setRevertOpen(false);
    for (const [field, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el && field in lastSaved) {
        el.innerText = lastSaved[field as keyof typeof lastSaved] as string;
      }
    }
    setContent(lastSaved);
    setSaved(false);
    showToast("success", "Changes discarded.");
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
      setLastSaved((prev) => ({ ...prev, ...updates } as LandingContentData));
      setSaved(true);
      showToast("success", "Changes saved successfully.");
    } else {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error || "Failed to save changes.");
    }
  }

  const c = content;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Admin toolbar ─────────────────────────────────────────────────── */}
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
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-black">Edit Mode — Home</p>
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
          <a href="/" target="_blank" rel="noopener noreferrer" className="border border-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70 transition hover:border-black/60 hover:text-black">
            Preview ↗
          </a>
          <button onClick={() => setRevertOpen(true)} className="border border-black/30 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/60 transition hover:border-black/60 hover:text-black">
            Discard Changes
          </button>
          <button onClick={save} disabled={saving} className="bg-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400 transition hover:bg-black/80 disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Page render (editable) ────────────────────────────────────────── */}
      <main className="min-h-screen w-full pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative min-h-[88vh] bg-[#0a0806] flex flex-col justify-center overflow-hidden">
          <EditBadge />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24 flex flex-col justify-center">
            <p ref={r("heroTagline")} contentEditable suppressContentEditableWarning className={`text-[10px] uppercase tracking-[0.38em] text-[#8a7b6d] mb-6 ${EDIT_DARK}`}>
              {c.heroTagline}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.08] text-white max-w-3xl">
              <span ref={r("heroLine1")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.heroLine1}</span>
              <br />
              <em className="italic text-[#c8a96e]">
                <span ref={r("heroAccent")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.heroAccent}</span>
              </em>
              <br />
              <span ref={r("heroLine3")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.heroLine3}</span>
            </h1>
            <p ref={r("heroSubtext")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-[42ch] text-[13.5px] leading-[1.9] text-[#9e8d7a] ${EDIT_DARK}`}>
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
                    <span ref={r(vf)} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c[vf]}</span>
                    {c[uf] !== "" && (
                      <span ref={r(uf)} contentEditable suppressContentEditableWarning className={`ml-1 text-[1.4rem] text-[#c8a96e] ${EDIT_DARK}`}>{c[uf]}</span>
                    )}
                  </p>
                  <p ref={r(lf)} contentEditable suppressContentEditableWarning className={`mt-3 text-[10px] uppercase tracking-[0.26em] text-[#6b5e54] ${EDIT_DARK}`}>
                    {c[lf]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S3: Who We Are */}
        <section className="relative bg-[#1c1814] py-24 lg:py-32 px-8">
          <EditBadge />
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#c8a96e] mb-5">Who We Are</p>
            <h2 className="text-[1.75rem] md:text-[2.1rem] font-bold leading-[1.18] text-white mb-8 max-w-3xl">
              <span ref={r("whoWeAreHeading")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.whoWeAreHeading}</span>
            </h2>
            <p ref={r("whoWeAreBody")} contentEditable suppressContentEditableWarning className={`text-[14px] leading-[1.95] text-[#9e8d7a] max-w-[68ch] mb-8 ${EDIT_DARK}`}>
              {c.whoWeAreBody}
            </p>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">
              → Meet our team
            </span>
          </div>
        </section>

        {/* S4: What We Do */}
        <section className="relative bg-[#f6f2eb] py-24 lg:py-32 px-8">
          <EditBadge />
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">What We Do</p>
            <h2 ref={r("ethosHeading")} contentEditable suppressContentEditableWarning className={`text-4xl md:text-5xl lg:text-[3.2rem] font-light leading-[1.15] text-[#1f1a17] mb-10 ${EDIT_LIGHT}`}>
              {c.ethosHeading}
            </h2>
            <div className="space-y-5 text-[14px] leading-[1.95] text-[#3d3530] max-w-[68ch] mb-10">
              <p ref={r("ethosBody")} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c.ethosBody}</p>
              <p ref={r("whatWeDoBody2")} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c.whatWeDoBody2}</p>
            </div>
            <p ref={r("whatWeDoBody3")} contentEditable suppressContentEditableWarning className={`text-[14px] leading-[1.9] text-[#3d3530] max-w-[68ch] ${EDIT_LIGHT}`}>
              {c.whatWeDoBody3}
            </p>
          </div>
        </section>

        {/* S4: Our Transition */}
        <section className="relative bg-[#2f2a24] py-24 lg:py-32 px-8">
          <EditBadge />
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">Our Transition</p>
            <h2 ref={r("transitionHeading")} contentEditable suppressContentEditableWarning className={`text-3xl md:text-4xl lg:text-[2.8rem] font-light leading-[1.2] text-white mb-10 ${EDIT_DARK}`}>
              {c.transitionHeading}
            </h2>
            <div className="space-y-5 text-[14px] leading-[1.95] text-[#9e8d7a] max-w-[64ch] mb-12">
              <p ref={r("transitionP1")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.transitionP1}</p>
              <p ref={r("transitionP2")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.transitionP2}</p>
              <p ref={r("transitionP3")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.transitionP3}</p>
              <p ref={r("transitionP4")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.transitionP4}</p>
            </div>
            <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em]">
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ Investors</span>
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ Owner-occupiers</span>
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ Developers</span>
            </div>
          </div>
        </section>

        {/* S5: Federal Budget */}
        <section className="relative bg-white py-24 lg:py-32 px-8">
          <EditBadge />
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">The 2026 Federal Budget</p>
            <h2 ref={r("budgetHeading")} contentEditable suppressContentEditableWarning className={`text-3xl md:text-4xl lg:text-[2.8rem] font-light leading-[1.2] text-[#1f1a17] mb-10 ${EDIT_LIGHT}`}>
              {c.budgetHeading}
            </h2>
            <ul className="space-y-4 mb-8">
              {(["budgetBullet1", "budgetBullet2"] as const).map((field) => (
                <li key={field} className="flex items-start gap-4 text-[13.5px] leading-[1.85] text-[#1f1a17]">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                  <span ref={r(field)} contentEditable suppressContentEditableWarning className={`font-medium ${EDIT_LIGHT}`}>{c[field]}</span>
                </li>
              ))}
            </ul>
            <p ref={r("budgetBody")} contentEditable suppressContentEditableWarning className={`text-[14px] leading-[1.95] text-[#3d3530] max-w-[68ch] mb-8 ${EDIT_LIGHT}`}>
              {c.budgetBody}
            </p>
            <div className="flex flex-wrap gap-8 mb-8 text-[11px] uppercase tracking-[0.2em]">
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ Read the full Insights briefing</span>
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ See the 2026 advantages in detail</span>
            </div>
            <p ref={r("budgetDisclaimer")} contentEditable suppressContentEditableWarning className={`text-[12px] italic text-[#8a7b6d] max-w-[64ch] ${EDIT_LIGHT}`}>
              {c.budgetDisclaimer}
            </p>
          </div>
        </section>

        {/* S6: Why Choose PPM */}
        <section className="relative bg-[#1c1814] py-24 lg:py-32 px-8">
          <EditBadge />
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">Why Choose PPM</p>
            <h2 ref={r("whyHeading")} contentEditable suppressContentEditableWarning className={`text-3xl md:text-4xl lg:text-[2.8rem] font-light leading-[1.2] text-white mb-14 ${EDIT_DARK}`}>
              {c.whyHeading}
            </h2>
            <div className="grid sm:grid-cols-2 gap-px bg-white/[0.04]">
              {(["why1","why2","why3","why4","why5","why6"] as const).map((field, i) => (
                <div key={field} className="bg-[#1c1814] px-8 py-8 border-t border-white/[0.06]">
                  <span className="block text-[9px] uppercase tracking-[0.28em] text-[#4a3f37] mb-3">{String(i + 1).padStart(2, "0")}</span>
                  <p ref={r(field)} contentEditable suppressContentEditableWarning className={`text-[13.5px] leading-[1.85] text-[#9e8d7a] ${EDIT_DARK}`}>
                    {c[field]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em]">
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ Read what our clients say</span>
              <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ Download sales &amp; management authorities</span>
            </div>
            <div className="mt-10 border-t border-white/[0.06] pt-10">
              <p ref={r("whyStewardBody")} contentEditable suppressContentEditableWarning className={`text-[14px] leading-[1.95] text-[#9e8d7a] max-w-[64ch] mb-6 ${EDIT_DARK}`}>
                {c.whyStewardBody}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
                <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ What to steward actually means for your investment</span>
                <span className="text-[#9e8d7a]">[</span>
                <span className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5">→ For Investors</span>
                <span className="text-[#9e8d7a]">]</span>
              </div>
            </div>
          </div>
        </section>


        {/* S9: CTA */}
        <section className="relative bg-[#1c1814] border-t border-white/[0.06] py-28 px-8">
          <EditBadge />
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#6b5e54] mb-6">Ready to begin?</p>
            <h2 ref={r("ctaHeading")} contentEditable suppressContentEditableWarning className={`text-4xl md:text-5xl font-light text-neutral-100 leading-snug mb-10 ${EDIT_DARK}`}>
              {c.ctaHeading}
            </h2>
          </div>
        </section>

      </main>

      {/* Revert confirmation */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Discard changes</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will undo all unsaved edits and restore the page to the last saved state. Projects are not affected.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setRevertOpen(false)} className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900">
                Cancel
              </button>
              <button type="button" onClick={confirmRevert} className="rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
