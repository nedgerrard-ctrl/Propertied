"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { aboutDefaults, AboutContentData } from "@/lib/about-defaults";
import ThreadsBackground from "@/app/about/ThreadsBackground";
import dynamic from "next/dynamic";

const GlobeCanvas = dynamic(() => import("@/app/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#13100d]" />,
});

type Field = keyof AboutContentData;

const EDIT_LIGHT = "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK  = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

const ACCEPTED = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif";

function ImageUploader({
  field,
  src,
  alt,
  onUpload,
}: {
  field: Field;
  src: string;
  alt: string;
  onUpload: (field: Field, path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }

    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed.");
    } else {
      onUpload(field, data.path);
    }

    // reset so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className="relative min-h-[360px] lg:min-h-[480px] bg-[#e4dbd1] overflow-hidden group">
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e4dbd1]">
          <p className="text-[12px] text-[#8a7b6d]">No image</p>
        </div>
      )}

      {/* Hover overlay */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
      >
        {uploading ? (
          <span className="text-[13px] font-semibold text-white">Uploading…</span>
        ) : (
          <>
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              Upload Image
            </span>
            <span className="text-[10px] text-white/60">JPEG · PNG · WebP · GIF · max 5 MB</span>
          </>
        )}
      </button>

      {/* Amber edit badge on image */}
      <span className="absolute top-2 left-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-black select-none z-10 opacity-60 group-hover:opacity-0 transition-opacity">
        ✎ Image
      </span>

      {error && (
        <div className="absolute bottom-0 inset-x-0 bg-red-600 px-3 py-2 text-[11px] text-white font-medium">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

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
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});
  const [imagePaths, setImagePaths] = useState<Partial<Record<Field, string>>>({});

  function handleImageUpload(field: Field, path: string) {
    setImagePaths((prev) => ({ ...prev, [field]: path }));
    // store in refs so save() picks it up
    const el = document.createElement("span");
    el.innerText = path;
    refs.current[field] = el;
  }

  useEffect(() => {
    fetch("/api/admin/content/about")
      .then((r) => r.json())
      .then((data) => {
        setContent((prev) => ({ ...prev, ...data }));
        setImagePaths({
          member1Image: data.member1Image || aboutDefaults.member1Image,
          member2Image: data.member2Image || aboutDefaults.member2Image,
        });
        setLoading(false);
      });
  }, []);

  function r(field: Field) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  async function confirmRevert() {
    setRevertOpen(false);

    for (const [field, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el && field in aboutDefaults) {
        el.innerText = aboutDefaults[field as keyof typeof aboutDefaults];
      }
    }

    setContent(aboutDefaults);
    setImagePaths({
      member1Image: aboutDefaults.member1Image,
      member2Image: aboutDefaults.member2Image,
    });
    setSaved(false);

    await fetch("/api/admin/content/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aboutDefaults),
    });
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
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  const c = content;

  const cycleSteps = [
    { step: "01", titleField: "step1Title" as Field, descField: "step1Desc" as Field },
    { step: "02", titleField: "step2Title" as Field, descField: "step2Desc" as Field },
    { step: "03", titleField: "step3Title" as Field, descField: "step3Desc" as Field },
    { step: "04", titleField: "step4Title" as Field, descField: "step4Desc" as Field },
    { step: "05", titleField: "step5Title" as Field, descField: "step5Desc" as Field },
    { step: "06", titleField: "step6Title" as Field, descField: "step6Desc" as Field },
  ];

  const stats = [
    { valueField: "stat1Value" as Field, labelField: "stat1Label" as Field },
    { valueField: "stat2Value" as Field, labelField: "stat2Label" as Field },
    { valueField: "stat3Value" as Field, labelField: "stat3Label" as Field },
  ];

  const team = [
    { nameField: "member1Name" as Field, roleField: "member1Role" as Field, imageField: "member1Image" as Field, bioField: "member1Bio" as Field },
    { nameField: "member2Name" as Field, roleField: "member2Role" as Field, imageField: "member2Image" as Field, bioField: "member2Bio" as Field },
  ];

  const services = ["service1", "service2", "service3", "service4"] as Field[];

  const projects = [
    { locField: "project1Location" as Field, typeField: "project1Type" as Field, statusField: "project1Status" as Field },
    { locField: "project2Location" as Field, typeField: "project2Type" as Field, statusField: "project2Status" as Field },
    { locField: "project3Location" as Field, typeField: "project3Type" as Field, statusField: "project3Status" as Field },
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

        {/* S2: Brand Story */}
        <section className="relative bg-white py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 lg:items-start">
              <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-10 pt-1">
                <p className="text-2xl lg:text-[1.85rem] font-light italic text-[#1f1a17] leading-snug">
                  &ldquo;<span ref={r("pullQuote")} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c.pullQuote}</span>&rdquo;
                </p>
              </div>
              <div className="space-y-5 text-[14px] leading-[1.95] text-[#3d3530]">
                {(["storyP1","storyP2","storyP3","storyP4"] as Field[]).map((field) => (
                  <p key={field} ref={r(field)} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>
                    {c[field]}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* S3: Stats */}
        <section className="relative bg-[#f6f2eb] py-20 lg:py-24">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="flex flex-col sm:flex-row sm:divide-x divide-[#ddd3c6]">
              {stats.map(({ valueField, labelField }) => (
                <div key={valueField} className="flex-1 py-10 sm:py-0 sm:px-12 first:sm:pl-0 last:sm:pr-0 border-b sm:border-b-0 border-[#ddd3c6] last:border-b-0">
                  <p ref={r(valueField)} contentEditable suppressContentEditableWarning className={`text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] text-[#1f1a17] tabular-nums ${EDIT_LIGHT}`}>
                    {c[valueField]}
                  </p>
                  <p ref={r(labelField)} contentEditable suppressContentEditableWarning className={`text-[10px] uppercase tracking-[0.28em] text-[#8a7b6d] mt-4 ${EDIT_LIGHT}`}>
                    {c[labelField]}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#ddd3c6] mt-14" />
          </div>
        </section>

        {/* S4: Cycle Steps */}
        <section className="relative bg-white py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">Our Approach</p>
              <h2 className="text-2xl lg:text-3xl font-light text-[#1f1a17]">The End-to-End Model</h2>
            </div>
            <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14">
              {cycleSteps.map(({ step, titleField, descField }) => (
                <div key={step} className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_11rem_1fr] gap-x-6 lg:gap-x-10 gap-y-1 py-9 border-b border-[#f0ebe4] last:border-b-0">
                  <p className="text-[2.6rem] font-thin text-[#e0d8d0] tabular-nums leading-none select-none row-span-2 lg:row-span-1 self-center">{step}</p>
                  <p ref={r(titleField)} contentEditable suppressContentEditableWarning className={`text-[15px] font-semibold text-[#1f1a17] self-center ${EDIT_LIGHT}`}>
                    {c[titleField]}
                  </p>
                  <p ref={r(descField)} contentEditable suppressContentEditableWarning className={`col-start-2 lg:col-start-3 text-[13px] leading-[1.85] text-[#5b5147] max-w-[54ch] ${EDIT_LIGHT}`}>
                    {c[descField]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S5: Overseas Reach */}
        <section className="relative overflow-hidden bg-[#13100d]">
          <EditBadge />
          <div className="mx-auto max-w-7xl">
            <div className="grid min-h-[540px] lg:grid-cols-2">
              <div className="flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-16">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#9e8d7a]">
                  Overseas Investor Specialists
                </p>
                <h2 className="mt-4 text-[26px] font-light leading-[1.35] text-white sm:text-[30px]">
                  <span ref={r("overseasHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.overseasHeadingMain}</span>{" "}
                  <span ref={r("overseasHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>{c.overseasHeadingAccent}</span>
                </h2>
                <p ref={r("overseasP1")} contentEditable suppressContentEditableWarning className={`mt-5 max-w-[420px] text-[13px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
                  {c.overseasP1}
                </p>
                <p ref={r("overseasP2")} contentEditable suppressContentEditableWarning className={`mt-4 max-w-[420px] text-[13px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
                  {c.overseasP2}
                </p>
                <div className="mt-10 grid grid-cols-3 gap-px border border-[#2d2218] bg-[#2d2218]">
                  {([
                    { vf: "overseasStat1Value" as Field, lf: "overseasStat1Label" as Field },
                    { vf: "overseasStat2Value" as Field, lf: "overseasStat2Label" as Field },
                    { vf: "overseasStat3Value" as Field, lf: "overseasStat3Label" as Field },
                  ]).map(({ vf, lf }) => (
                    <div key={vf} className="bg-[#1a1410] px-3 py-5 text-center">
                      <p ref={r(vf)} contentEditable suppressContentEditableWarning className={`text-[18px] font-semibold tracking-tight text-[#c8a96e] sm:text-[20px] ${EDIT_DARK}`}>
                        {c[vf]}
                      </p>
                      <p ref={r(lf)} contentEditable suppressContentEditableWarning className={`mt-1 text-[9px] uppercase tracking-[0.16em] text-[#5e4e44] sm:text-[10px] ${EDIT_DARK}`}>
                        {c[lf]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <span className="inline-block border border-[#c8a96e] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] opacity-50 cursor-default select-none">
                    Start Your Journey
                  </span>
                </div>
              </div>
              <div className="relative min-h-[340px] bg-[#13100d] lg:min-h-0">
                <GlobeCanvas />
                <p className="pointer-events-none absolute bottom-5 right-6 text-right text-[10px] uppercase tracking-[0.22em] text-[#3d3028]">
                  Melbourne, Australia
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* S6: Team */}
        <section className="relative bg-[#f6f2eb]">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8 pt-24 pb-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">The People</p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-light text-[#1f1a17]">Our Leadership</h2>
          </div>
          {team.map(({ nameField, roleField, imageField, bioField }, i) => (
            <div key={nameField} className="grid lg:grid-cols-2 mt-14 border-t border-[#ddd3c6] first:mt-10">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <ImageUploader
                  field={imageField}
                  src={imagePaths[imageField] || c[imageField]}
                  alt={c[nameField]}
                  onUpload={handleImageUpload}
                />
              </div>
              <div className={`flex flex-col justify-center px-8 py-14 lg:px-14 xl:px-20 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <h3 ref={r(nameField)} contentEditable suppressContentEditableWarning className={`text-[22px] font-light text-[#1f1a17] ${EDIT_LIGHT}`}>
                  {c[nameField]}
                </h3>
                <p ref={r(roleField)} contentEditable suppressContentEditableWarning className={`mt-1.5 text-[10px] uppercase tracking-[0.26em] text-[#8a7b6d] ${EDIT_LIGHT}`}>
                  {c[roleField]}
                </p>
                <div className="mt-5 w-8 border-t border-[#ddd3c6]" />
                <p ref={r(bioField)} contentEditable suppressContentEditableWarning className={`mt-6 text-[13px] leading-[1.95] text-[#3d3530] max-w-[44ch] ${EDIT_LIGHT}`}>
                  {c[bioField]}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* S7: Developer Services */}
        <section className="relative bg-[#2f2a24] py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 lg:items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d] mb-6">Developer Services</p>
                <h2 ref={r("devHeading")} contentEditable suppressContentEditableWarning className={`text-3xl lg:text-[2.75rem] font-light leading-[1.2] text-white ${EDIT_DARK}`}>
                  {c.devHeading}
                </h2>
              </div>
              <div>
                <div className="space-y-5 text-[14px] leading-[1.9] text-[#9e8d7a]">
                  <p ref={r("devP1")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.devP1}</p>
                  <p ref={r("devP2")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.devP2}</p>
                </div>
                <div className="mt-12">
                  {services.map((field) => (
                    <div key={field} className="py-5 border-t border-[#3d3530]">
                      <p ref={r(field)} contentEditable suppressContentEditableWarning className={`text-[13px] tracking-[0.05em] text-[#9e8d7a] ${EDIT_DARK}`}>
                        {c[field]}
                      </p>
                    </div>
                  ))}
                  <div className="border-t border-[#3d3530]" />
                </div>
                <div className="mt-10">
                  <Link href="/contact/developers" className="inline-block border border-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#2f2a24]">
                    Partner With Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S8: Track Record */}
        <section className="relative bg-white py-24 lg:py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">Our Track Record</p>
            <h2 ref={r("trackHeading")} contentEditable suppressContentEditableWarning className={`mt-6 text-4xl lg:text-6xl font-light leading-[1.1] text-[#1f1a17] max-w-3xl ${EDIT_LIGHT}`}>
              {c.trackHeading}
            </h2>
            <div className="mt-16">
              {projects.map(({ locField, typeField, statusField }) => (
                <div key={locField} className="grid grid-cols-3 py-5 border-t border-[#f0ebe4] text-[13px] text-[#5b5147]">
                  <span ref={r(locField)} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c[locField]}</span>
                  <span ref={r(typeField)} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c[typeField]}</span>
                  <span ref={r(statusField)} contentEditable suppressContentEditableWarning className={`text-right ${EDIT_LIGHT}`}>{c[statusField]}</span>
                </div>
              ))}
              <div className="border-t border-[#f0ebe4]" />
            </div>
          </div>
        </section>

        {/* S9: CTA */}
        <section className="bg-[#1c1814] py-32 lg:py-44">
          <div className="mx-auto max-w-7xl px-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#4a3f37]">Next Steps</p>
            <h2 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.06]">Ready to begin?</h2>
            <p className="mt-6 text-[14px] text-[#8a7b6d] max-w-[40ch] mx-auto leading-[1.9]">
              Whether you are a buyer, investor, or developer — the conversation starts here.
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
              This will reset all text and images back to the original defaults and overwrite any saved changes. This cannot be undone.
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
