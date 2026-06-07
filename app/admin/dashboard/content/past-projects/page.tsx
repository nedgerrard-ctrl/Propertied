"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  pastProjectsDefaults,
  PastProjectsContentData,
  PastProject,
} from "@/lib/past-projects-defaults";

// ── Types ──────────────────────────────────────────────────────────────────────
type HeroField = "heroHeadingMain" | "heroHeadingAccent" | "heroSubtext" | "closingText";

// ── Style constants ────────────────────────────────────────────────────────────
const EDIT_DARK =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

const inputBase =
  "w-full rounded border px-3 py-2 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none transition-colors";
const inputNormal = `${inputBase} border-neutral-200 focus:border-amber-400`;
const labelCls =
  "block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1";

// ── Helpers ────────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function blankProject(): PastProject {
  return { id: uid(), name: "", address: "", imageUrl: "", link: "" };
}

async function uploadImageToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.path as string;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
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

function ImagePlaceholder({ uploading }: { uploading?: boolean }) {
  return (
    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 bg-[#1c1814]">
      {uploading ? (
        <>
          <svg className="h-5 w-5 animate-spin text-[#c8a96e]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#c8a96e]">Uploading…</span>
        </>
      ) : (
        <>
          <svg className="h-6 w-6 text-[#4a3f37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#4a3f37]">No image</span>
        </>
      )}
    </div>
  );
}

// ── Card editor row ────────────────────────────────────────────────────────────
function ProjectCardEditor({
  project,
  index,
  total,
  uploading,
  uploadError,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onImageUpload,
  onImageRemove,
}: {
  project:       PastProject
  index:         number
  total:         number
  uploading:     boolean
  uploadError:   string | null
  onChange:      (id: string, field: keyof PastProject, value: string) => void
  onRemove:      (id: string) => void
  onMoveUp:      (index: number) => void
  onMoveDown:    (index: number) => void
  onImageUpload: (id: string, file: File) => void
  onImageRemove: (id: string) => void
}) {
  const [imgLoadError, setImgLoadError] = useState(false);
  useEffect(() => { setImgLoadError(false); }, [project.imageUrl]);

  const hasImage = !!project.imageUrl && !imgLoadError;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Project {index + 1}{project.name ? ` — ${project.name}` : ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            title="Move up"
            className="rounded p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4l-5 5h10L8 4z" /></svg>
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            title="Move down"
            className="rounded p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12l5-5H3l5 5z" /></svg>
          </button>
          <button
            onClick={() => onRemove(project.id)}
            title="Remove project"
            className="ml-1 rounded px-2 py-1 text-[11px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-4 md:grid-cols-2">

        {/* Left: image upload */}
        <div>
          <label className={labelCls}>Project Image</label>

          {/* Preview */}
          <div className="overflow-hidden rounded border border-neutral-200">
            {hasImage ? (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="aspect-[16/9] w-full object-cover"
                onError={() => setImgLoadError(true)}
              />
            ) : (
              <ImagePlaceholder uploading={uploading} />
            )}
          </div>

          {/* Upload / Replace / Remove buttons */}
          <div className="mt-2 flex items-center gap-2">
            <label
              className={[
                "inline-flex cursor-pointer items-center gap-1.5 rounded border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition",
                uploading
                  ? "cursor-not-allowed border-neutral-200 text-neutral-300"
                  : "border-neutral-200 text-neutral-600 hover:border-amber-400 hover:text-amber-600",
              ].join(" ")}
            >
              {uploading ? (
                <>
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 11V3M5 6l3-3 3 3" /><path d="M2 13h12" />
                  </svg>
                  {hasImage ? "Replace Image" : "Upload Image"}
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(project.id, file);
                  e.target.value = "";
                }}
              />
            </label>

            {hasImage && !uploading && (
              <button
                type="button"
                onClick={() => onImageRemove(project.id)}
                className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-500 transition hover:bg-red-100 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>

          {/* Upload error */}
          {uploadError && (
            <p className="mt-1.5 text-[11px] font-medium text-red-600">{uploadError}</p>
          )}

          <p className="mt-1.5 text-[10px] text-neutral-400">
            JPEG, PNG, WebP, GIF or AVIF · max 5 MB
          </p>
        </div>

        {/* Right: form fields */}
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelCls}>Project Name *</label>
            <input
              className={inputNormal}
              value={project.name}
              placeholder="e.g. Hawthorn Park"
              onChange={(e) => onChange(project.id, "name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Address / Suburb</label>
            <input
              className={inputNormal}
              value={project.address}
              placeholder="e.g. Hawthorn, Melbourne VIC"
              onChange={(e) => onChange(project.id, "address", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Link (opens in new tab)</label>
            <input
              className={inputNormal}
              value={project.link}
              placeholder="https://…"
              onChange={(e) => onChange(project.id, "link", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main editor ────────────────────────────────────────────────────────────────
export default function PastProjectsInlineEditor() {
  const [heroContent, setHeroContent] = useState({
    heroHeadingMain:   pastProjectsDefaults.heroHeadingMain,
    heroHeadingAccent: pastProjectsDefaults.heroHeadingAccent,
    heroSubtext:       pastProjectsDefaults.heroSubtext,
    closingText:       pastProjectsDefaults.closingText,
  });
  const [projects, setProjects]     = useState<PastProject[]>(pastProjectsDefaults.projects);
  const [lastSaved, setLastSaved]   = useState<PastProjectsContentData>(pastProjectsDefaults);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);

  // Per-card upload state
  const [uploadingIds, setUploadingIds]   = useState<Set<string>>(new Set());
  const [uploadErrors, setUploadErrors]   = useState<Record<string, string>>({});

  const heroRefs = useRef<Partial<Record<HeroField, HTMLElement | null>>>({});

  useEffect(() => {
    fetch("/api/admin/content/past-projects")
      .then((r) => r.json())
      .then((data: PastProjectsContentData) => {
        setHeroContent({
          heroHeadingMain:   data.heroHeadingMain,
          heroHeadingAccent: data.heroHeadingAccent,
          heroSubtext:       data.heroSubtext,
          closingText:       data.closingText,
        });
        setProjects(data.projects);
        setLastSaved(data);
        setLoading(false);
      });
  }, []);

  // ── Hero refs ──────────────────────────────────────────────────────────────
  function rh(field: HeroField) {
    return (el: HTMLElement | null) => { heroRefs.current[field] = el; };
  }

  // ── Image upload ───────────────────────────────────────────────────────────
  async function handleImageUpload(id: string, file: File) {
    setUploadingIds((prev) => new Set(prev).add(id));
    setUploadErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });

    try {
      const url = await uploadImageToCloudinary(file);
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, imageUrl: url } : p));
      setSaved(false);
    } catch (err) {
      setUploadErrors((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : "Upload failed.",
      }));
    } finally {
      setUploadingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  }

  function handleImageRemove(id: string) {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, imageUrl: "" } : p));
    setUploadErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setSaved(false);
  }

  // ── Card handlers ──────────────────────────────────────────────────────────
  function handleCardChange(id: string, field: keyof PastProject, value: string) {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    setSaved(false);
  }

  function handleRemoveCard(id: string) {
    if (!confirm("Remove this project card?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSaved(false);
  }

  function handleAddCard() {
    setProjects((prev) => [...prev, blankProject()]);
    setSaved(false);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    setProjects((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSaved(false);
  }

  function handleMoveDown(index: number) {
    setProjects((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setSaved(false);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function save() {
    const heroUpdates = {
      heroHeadingMain:   heroRefs.current.heroHeadingMain?.innerText.trim()   || heroContent.heroHeadingMain,
      heroHeadingAccent: heroRefs.current.heroHeadingAccent?.innerText.trim() || heroContent.heroHeadingAccent,
      heroSubtext:       heroRefs.current.heroSubtext?.innerText.trim()       || heroContent.heroSubtext,
      closingText:       heroRefs.current.closingText?.innerText.trim()       || heroContent.closingText,
    };

    setSaving(true);
    const res = await fetch("/api/admin/content/past-projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...heroUpdates, projects }),
    });
    setSaving(false);
    if (res.ok) {
      setHeroContent(heroUpdates);
      setLastSaved({ ...heroUpdates, projects });
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  // ── Revert ─────────────────────────────────────────────────────────────────
  async function confirmRevert() {
    setRevertOpen(false);
    const fields: HeroField[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext", "closingText"];
    for (const f of fields) {
      const el = heroRefs.current[f];
      if (el) el.innerText = lastSaved[f];
    }
    setHeroContent({
      heroHeadingMain:   lastSaved.heroHeadingMain,
      heroHeadingAccent: lastSaved.heroHeadingAccent,
      heroSubtext:       lastSaved.heroSubtext,
      closingText:       lastSaved.closingText,
    });
    setProjects(lastSaved.projects);
    setUploadErrors({});
    setSaved(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  const anyUploading = uploadingIds.size > 0;

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
              Edit Mode — Past Projects
            </p>
          </div>
          {anyUploading && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-black/60">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Uploading image…
            </span>
          )}
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
            href="/past-projects"
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
            disabled={saving || anyUploading}
            className="bg-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400 transition hover:bg-black/80 disabled:opacity-50"
          >
            {saving ? "Saving…" : anyUploading ? "Wait…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="pt-[48px]">
        {/* ── S1: Hero preview (contentEditable) ──────────────────────────── */}
        <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden [&_a]:pointer-events-none [&_a]:cursor-default">
          <EditBadge />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Past Projects</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">A Selection of Our Work</p>
            </div>
            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
                <span ref={rh("heroHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                  {heroContent.heroHeadingMain}
                </span>
                <br />
                <span ref={rh("heroHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>
                  {heroContent.heroHeadingAccent}
                </span>
              </h1>
            </div>
            <p ref={rh("heroSubtext")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
              {heroContent.heroSubtext}
            </p>
            <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
              <span className="block h-px w-10 bg-[#3a302a]" />
              <span>{projects.length} Development{projects.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </section>

        {/* ── S2: Projects editor ──────────────────────────────────────────── */}
        <section className="bg-neutral-100 py-16">
          <div className="mx-auto max-w-5xl px-6">

            {/* Section header */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Project Cards
                </p>
                <p className="mt-1 text-[12px] text-neutral-400">
                  Upload an image per card, fill in details, reorder with arrows, then click&nbsp;
                  <strong className="font-semibold text-neutral-600">Save Changes</strong>.
                </p>
              </div>
              <button
                onClick={handleAddCard}
                className="flex items-center gap-2 rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
                </svg>
                Add Project
              </button>
            </div>

            {/* Card list */}
            {projects.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-neutral-300 py-20 text-center">
                <p className="text-[13px] text-neutral-400">No project cards yet.</p>
                <button
                  onClick={handleAddCard}
                  className="mt-4 rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
                >
                  + Add First Project
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, i) => (
                  <ProjectCardEditor
                    key={project.id}
                    project={project}
                    index={i}
                    total={projects.length}
                    uploading={uploadingIds.has(project.id)}
                    uploadError={uploadErrors[project.id] ?? null}
                    onChange={handleCardChange}
                    onRemove={handleRemoveCard}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                  />
                ))}
              </div>
            )}

            {/* Bottom add button */}
            {projects.length > 0 && (
              <button
                onClick={handleAddCard}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 transition hover:border-[#c8a96e] hover:text-[#c8a96e]"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
                </svg>
                Add Another Project
              </button>
            )}

            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
              <strong>Remember:</strong> images upload instantly to Cloudinary, but click&nbsp;
              <strong>Save Changes</strong> in the toolbar to persist all card details and hero text.
            </div>

          </div>
        </section>

        {/* ── S3: Closing text ─────────────────────────────────────────────── */}
        <section className="relative bg-[#f6f2eb] py-20 lg:py-28">
          <EditBadge />
          <div className="mx-auto max-w-2xl px-8">
            <p
              ref={rh("closingText")}
              contentEditable
              suppressContentEditableWarning
              className={`text-[14px] leading-[1.95] text-[#3d3530] ${EDIT_DARK}`}
            >
              {heroContent.closingText}
            </p>
          </div>
        </section>
      </div>

      {/* ── Revert modal ─────────────────────────────────────────────────── */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Discard changes</h2>
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
