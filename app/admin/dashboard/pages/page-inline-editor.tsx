"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FloatingDust = dynamic(
  () => import("@/app/components/FloatingDust"),
  { ssr: false, loading: () => null }
);

const EDIT_LIGHT =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

type Section = { id: number; heading: string; body: string; image: string };

type PageData = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  templateKey: "text-only" | "text-image";
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  body: string;
  sections: { heading: string; body: string; image: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaLink: string;
};

function EditBadge() {
  return (
    <span className="absolute top-4 right-4 z-20 flex select-none items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black shadow">
      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
      </svg>
      Editable
    </span>
  );
}

function SectionImageUploader({
  src,
  onUpload,
}: {
  src: string;
  onUpload: (path: string) => void;
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
      onUpload(data.path);
    }
    e.target.value = "";
  }

  return (
    <div className="group relative h-72 overflow-hidden bg-[#e8e2da] lg:h-[420px]">
      {src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b8a898]">
            No image
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-wait"
      >
        {uploading ? (
          <span className="text-[13px] font-semibold text-white">
            Uploading…
          </span>
        ) : (
          <>
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              {src ? "Replace Image" : "Upload Image"}
            </span>
            <span className="text-[10px] text-white/60">
              JPEG · PNG · WebP · max 5 MB
            </span>
          </>
        )}
      </button>

      <span className="absolute left-2 top-2 z-10 select-none rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-black opacity-60 transition-opacity group-hover:opacity-0">
        ✎ Image
      </span>

      {error && (
        <div className="absolute inset-x-0 bottom-0 bg-red-600 px-3 py-2 text-[11px] font-medium text-white">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export default function PageInlineEditor({
  initialData,
}: {
  initialData: PageData;
}) {
  const isTextImage = initialData.templateKey === "text-image";

  // Refs for fixed contentEditable fields
  const refs = useRef<Record<string, HTMLElement | null>>({});
  function r(field: string) {
    return (el: HTMLElement | null) => {
      refs.current[field] = el;
    };
  }

  // Sections state — used by both templates
  const [sections, setSections] = useState<Section[]>(() =>
    (initialData.sections?.length
      ? initialData.sections
      : [{ heading: "", body: "", image: "" }]
    ).map((s, i) => ({ ...s, id: i }))
  );
  const nextSectionId = useRef(initialData.sections?.length || 1);
  const sectionRefs = useRef<
    Map<number, { heading: HTMLElement | null; body: HTMLElement | null }>
  >(new Map());

  // Current publish status
  const [currentStatus, setCurrentStatus] = useState<"draft" | "published">(
    initialData.status
  );

  // Save state
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );

  function readValues() {
    const updates: Record<string, unknown> = {};
    for (const [key, el] of Object.entries(refs.current)) {
      if (el) updates[key] = el.innerText.trim();
    }
    updates.sections = sections.map((s) => {
      const sr = sectionRefs.current.get(s.id);
      return {
        heading: sr?.heading?.innerText?.trim() ?? s.heading,
        body: sr?.body?.innerText?.trim() ?? s.body,
        image: s.image,
      };
    });
    return updates;
  }

  async function saveDraft() {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const updates = readValues();
      const res = await fetch(`/api/admin/pages/${initialData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, status: "draft" }),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setPublishing(true);
    setSaveStatus("idle");
    try {
      const updates = readValues();
      const saveRes = await fetch(`/api/admin/pages/${initialData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, status: "draft" }),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      const pubRes = await fetch(
        `/api/admin/pages/${initialData._id}/publish`,
        { method: "POST" }
      );
      if (pubRes.ok) {
        setCurrentStatus("published");
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setPublishing(false);
    }
  }

  async function unpublish() {
    setUnpublishing(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(
        `/api/admin/pages/${initialData._id}/unpublish`,
        { method: "POST" }
      );
      if (res.ok) {
        setCurrentStatus("draft");
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setUnpublishing(false);
    }
  }

  function addSection() {
    const id = nextSectionId.current++;
    setSections((prev) => [
      ...prev,
      { id, heading: "", body: "", image: "" },
    ]);
  }

  function removeSection(id: number) {
    setSections((prev) => prev.filter((s) => s.id !== id));
    sectionRefs.current.delete(id);
  }

  function updateSectionImage(id: number, image: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, image } : s))
    );
  }

  function setHeadingRef(id: number, el: HTMLElement | null) {
    const existing = sectionRefs.current.get(id) ?? {
      heading: null,
      body: null,
    };
    sectionRefs.current.set(id, { ...existing, heading: el });
  }

  function setBodyRef(id: number, el: HTMLElement | null) {
    const existing = sectionRefs.current.get(id) ?? {
      heading: null,
      body: null,
    };
    sectionRefs.current.set(id, { ...existing, body: el });
  }

  const isBusy = saving || publishing || unpublishing;

  return (
    <>
      {/* ── Admin toolbar ─────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-6 py-3 shadow-lg">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/admin/dashboard/pages"
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 transition hover:text-black"
          >
            ← Manage Pages
          </Link>
          <span className="text-black/20">|</span>
          <div className="flex min-w-0 items-center gap-2">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-black"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            <p className="truncate text-[12px] font-bold uppercase tracking-[0.18em] text-black">
              Edit Mode — {initialData.title}
            </p>
          </div>
          <span className="hidden shrink-0 text-[11px] text-black/50 sm:inline">
            · Click any underlined text to edit
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-black/70">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-[12px] font-semibold text-red-700">
              Error saving
            </span>
          )}

          {/* Preview — only works when published */}
          <a
            href={`/more/${initialData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title={currentStatus === "draft" ? "Publish first to preview" : "Open live page"}
            className={`border border-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition ${
              currentStatus === "draft"
                ? "cursor-not-allowed text-black/30"
                : "text-black/70 hover:border-black/60 hover:text-black"
            }`}
            onClick={currentStatus === "draft" ? (e) => e.preventDefault() : undefined}
          >
            Preview ↗
          </a>

          <button
            onClick={saveDraft}
            disabled={isBusy}
            className="border border-black/30 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70 transition hover:border-black/60 hover:text-black disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>

          {currentStatus === "published" ? (
            <button
              onClick={unpublish}
              disabled={isBusy}
              className="bg-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400 transition hover:bg-black/80 disabled:opacity-50"
            >
              {unpublishing ? "Unpublishing…" : "Unpublish"}
            </button>
          ) : (
            <button
              onClick={publish}
              disabled={isBusy}
              className="bg-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400 transition hover:bg-black/80 disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
          )}
        </div>
      </div>

      {/* ── Editable page ─────────────────────────────────────────────── */}
      <main className="min-h-screen w-full pt-[48px] text-[#1f1a17] [&_a]:cursor-default [&_a]:pointer-events-none">

        {/* HERO — shared by both templates */}
        <section className="relative flex min-h-[78vh] flex-col justify-center overflow-hidden bg-[#1c1814]">
          <EditBadge />
          <FloatingDust />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <span
                ref={r("heroEyebrow")}
                contentEditable
                suppressContentEditableWarning
                className={`text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] ${EDIT_DARK}`}
              >
                {initialData.heroEyebrow || "Guide"}
              </span>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
                PPM Resource
              </p>
            </div>

            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="max-w-4xl text-5xl font-light leading-[1.06] text-white md:text-6xl lg:text-[4.5rem]">
                <span
                  ref={r("heroTitle")}
                  contentEditable
                  suppressContentEditableWarning
                  className={EDIT_DARK}
                >
                  {initialData.heroTitle || initialData.title}
                </span>
              </h1>
            </div>

            <span
              ref={r("heroSummary")}
              contentEditable
              suppressContentEditableWarning
              className={`mt-8 block max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}
            >
              {initialData.heroSummary || "Add a summary here…"}
            </span>

            <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
              <span className="block h-px w-10 bg-[#3a302a]" />
              <span>Read Guide</span>
            </div>
          </div>
        </section>

        {/* SECTIONS — text-only template (heading + body, no image) */}
        {!isTextImage && (
          <div>
            {sections.map((section, i) => {
              const isEven = i % 2 === 0;
              return (
                <section
                  key={section.id}
                  className={`relative py-20 lg:py-28 ${isEven ? "bg-[#f6f2eb]" : "bg-white"}`}
                >
                  <EditBadge />

                  {sections.length > 1 && (
                    <button
                      onClick={() => removeSection(section.id)}
                      className="absolute left-4 top-4 z-20 rounded border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-100"
                    >
                      Remove Section
                    </button>
                  )}

                  <div className="mx-auto max-w-7xl px-8">
                    <div className="grid gap-12 lg:grid-cols-[4fr_8fr]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9e8d7a]">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <span
                          ref={(el) => setHeadingRef(section.id, el)}
                          contentEditable
                          suppressContentEditableWarning
                          className={`block text-[26px] font-light leading-[1.35] text-[#1f1a17] sm:text-[30px] ${EDIT_LIGHT}`}
                        >
                          {section.heading || "Section Heading (optional)"}
                        </span>
                        <div className="mt-5 border-l-2 border-[#ddd3c6] pl-8 lg:pl-14">
                          <span
                            ref={(el) => setBodyRef(section.id, el)}
                            contentEditable
                            suppressContentEditableWarning
                            style={{ whiteSpace: "pre-wrap" }}
                            className={`block min-h-[80px] max-w-[58ch] text-[13px] leading-[1.9] text-[#5b5147] ${EDIT_LIGHT}`}
                          >
                            {section.body || "Write the section body here.\n\nPress Enter twice to start a new paragraph."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            {/* Add section */}
            <div className="flex items-center justify-center bg-neutral-100 py-8">
              <button
                onClick={addSection}
                className="rounded border border-[#5f5245] bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white"
              >
                + Add Section
              </button>
            </div>
          </div>
        )}

        {/* SECTIONS — text-image template (heading + body + alternating image) */}
        {isTextImage && (
          <div>
            {sections.map((section, i) => {
              const isEven = i % 2 === 0;
              return (
                <section
                  key={section.id}
                  className={`relative py-20 lg:py-28 ${isEven ? "bg-white" : "bg-[#f6f2eb]"}`}
                >
                  <EditBadge />

                  {sections.length > 1 && (
                    <button
                      onClick={() => removeSection(section.id)}
                      className="absolute left-4 top-4 z-20 rounded border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-100"
                    >
                      Remove Section
                    </button>
                  )}

                  <div className="mx-auto max-w-7xl px-8">
                    <div
                      className={`grid gap-12 lg:grid-cols-2 lg:items-center ${!isEven ? "lg:grid-flow-dense" : ""}`}
                    >
                      {/* Text column */}
                      <div className={!isEven ? "lg:col-start-2" : ""}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9e8d7a]">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <span
                          ref={(el) => setHeadingRef(section.id, el)}
                          contentEditable
                          suppressContentEditableWarning
                          className={`mt-4 block text-[26px] font-light leading-[1.35] text-[#1f1a17] sm:text-[30px] ${EDIT_LIGHT}`}
                        >
                          {section.heading || "Section Heading"}
                        </span>
                        <div className="mt-5 border-l-2 border-[#ddd3c6] pl-6">
                          <span
                            ref={(el) => setBodyRef(section.id, el)}
                            contentEditable
                            suppressContentEditableWarning
                            style={{ whiteSpace: "pre-wrap" }}
                            className={`block min-h-[60px] max-w-[46ch] text-[13px] leading-[1.9] text-[#5b5147] ${EDIT_LIGHT}`}
                          >
                            {section.body || "Write the section body text here."}
                          </span>
                        </div>
                      </div>

                      {/* Image column */}
                      <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                        <SectionImageUploader
                          src={section.image}
                          onUpload={(path) => updateSectionImage(section.id, path)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            {/* Add section */}
            <div className="flex items-center justify-center bg-neutral-100 py-8">
              <button
                onClick={addSection}
                className="rounded border border-[#5f5245] bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white"
              >
                + Add Section
              </button>
            </div>
          </div>
        )}

        {/* CTA — shared by both templates */}
        <section className="relative bg-[#1c1814] py-20 lg:py-28">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-8">
            <span
              ref={r("ctaTitle")}
              contentEditable
              suppressContentEditableWarning
              className={`block text-[2rem] font-light text-white ${EDIT_DARK}`}
            >
              {initialData.ctaTitle || "Add a call-to-action title…"}
            </span>
            <span
              ref={r("ctaText")}
              contentEditable
              suppressContentEditableWarning
              className={`mt-4 block max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}
            >
              {initialData.ctaText || "Add call-to-action text here…"}
            </span>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#4a3f37]">
                Button link:
              </span>
              <span
                ref={r("ctaLink")}
                contentEditable
                suppressContentEditableWarning
                className={`text-[12px] text-[#8a7b6d] ${EDIT_DARK}`}
              >
                {initialData.ctaLink || "/contact"}
              </span>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
