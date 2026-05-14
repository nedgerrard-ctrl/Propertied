"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { landingDefaults, LandingContentData } from "@/lib/landing-defaults";

// ─── Types ────────────────────────────────────────────────────────────────────

type Field = keyof LandingContentData;

type ShowcaseProject = {
  _id: string;
  name: string;
  address: string;
  image: string;
  order: number;
  published: boolean;
};

type ToastData = { type: "success" | "error"; message: string } | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const EDIT_LIGHT = "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK  = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

const inputBase   = "w-full rounded border px-3 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none transition-colors";
const inputNormal = `${inputBase} border-neutral-200 focus:border-amber-400`;
const inputError  = `${inputBase} border-red-400 bg-red-50/30 focus:border-red-500`;
const labelClass  = "block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1.5";

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

// ─── Showcase modals ──────────────────────────────────────────────────────────

function ShowcaseModal({
  initial,
  title,
  onClose,
  onSave,
}: {
  initial: { name: string; address: string; image: string; published: boolean };
  title: string;
  onClose: () => void;
  onSave: (data: { name: string; address: string; image: string; published: boolean }) => Promise<void>;
}) {
  const [name, setName]           = useState(initial.name);
  const [address, setAddress]     = useState(initial.address);
  const [image, setImage]         = useState(initial.image);
  const [published, setPublished] = useState(initial.published);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState<{ name?: string; address?: string }>({});
  const [apiError, setApiError]   = useState("");

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.path) setImage(data.path);
      else setApiError(data.error || "Image upload failed.");
    } catch {
      setApiError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const errs: { name?: string; address?: string } = {};
    if (!name.trim())    errs.name    = "Required";
    if (!address.trim()) errs.address = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    await onSave({ name: name.trim(), address: address.trim(), image, published });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <form onSubmit={submit} className="my-auto w-full max-w-lg rounded-xl bg-white p-7 shadow-2xl">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        <p className="mt-1 text-sm text-neutral-500">Appears in the Completed Projects section on the home page.</p>

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[12px] font-medium text-red-700">{apiError}</p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: e.target.value.trim() ? "" : "Required" })); }}
              placeholder="e.g. Hawthorn Park"
              className={errors.name ? inputError : inputNormal}
            />
            {errors.name && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: e.target.value.trim() ? "" : "Required" })); }}
              placeholder="e.g. 55 Camberwell Rd, Hawthorn East VIC 3123"
              className={errors.address ? inputError : inputNormal}
            />
            {errors.address && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.address}</p>}
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>Project Image</label>
            {image && (
              <div className="mb-2 h-36 w-full overflow-hidden rounded border border-neutral-200">
                <img src={image} alt="preview" className="h-full w-full object-cover" />
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-neutral-300 px-4 py-3 text-[12px] text-neutral-500 transition hover:border-amber-400 hover:text-amber-600">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a.75.75 0 0 1 .75.75V6.5h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8H2.5a.75.75 0 0 1 0-1.5h4.75V1.75A.75.75 0 0 1 8 1Z" />
              </svg>
              {uploading ? "Uploading…" : image ? "Change Image" : "Upload Image"}
              <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} disabled={uploading} />
            </label>
            <p className="mt-1 text-[11px] text-neutral-400">JPEG, PNG or WebP — max 5 MB.</p>
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-neutral-800">Visible on home page</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Toggle off to hide without deleting</p>
            </div>
            <button
              type="button"
              onClick={() => setPublished((p) => !p)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${published ? "bg-amber-400" : "bg-neutral-300"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${published ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded bg-amber-400 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300 disabled:opacity-50"
          >
            {saving ? "Saving…" : title}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

export default function LandingInlineEditor() {
  // ── Text content state ──
  const [content, setContent]     = useState<LandingContentData>(landingDefaults);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  // ── Showcase state ──
  const [projects, setProjects]           = useState<ShowcaseProject[]>([]);
  const [addOpen, setAddOpen]             = useState(false);
  const [editingProject, setEditingProject] = useState<ShowcaseProject | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [togglingId, setTogglingId]       = useState<string | null>(null);
  const [toast, setToast]                 = useState<ToastData>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(type: "success" | "error", message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/content/landing").then((r) => r.json()),
      fetch("/api/admin/showcase").then((r) => r.json()),
    ]).then(([cmsData, projectsData]) => {
      setContent((prev) => ({ ...prev, ...cmsData }));
      setProjects(projectsData);
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
    showToast("success", "Content reverted to defaults.");
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
      showToast("success", "Changes saved successfully.");
    } else {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error || "Failed to save changes.");
    }
  }

  // ── Showcase CRUD ──
  async function addProject(data: { name: string; address: string; image: string; published: boolean }) {
    const res = await fetch("/api/admin/showcase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, order: projects.length }),
    });
    const result = await res.json();
    if (!res.ok) { showToast("error", result.error || "Failed to add project."); return; }
    setProjects((prev) => [...prev, result]);
    setAddOpen(false);
    showToast("success", `"${result.name}" added to showcase.`);
  }

  async function updateProject(id: string, data: { name: string; address: string; image: string; published: boolean }) {
    const res = await fetch(`/api/admin/showcase/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) { showToast("error", result.error || "Failed to update project."); return; }
    setProjects((prev) => prev.map((p) => (p._id === id ? { ...p, ...result } : p)));
    setEditingProject(null);
    showToast("success", `"${result.name}" updated.`);
  }

  async function deleteProject(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/showcase/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      showToast("success", "Project removed from showcase.");
    } else {
      showToast("error", "Failed to delete project.");
    }
  }

  async function togglePublish(project: ShowcaseProject) {
    setTogglingId(project._id);
    const res = await fetch(`/api/admin/showcase/${project._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published }),
    });
    setTogglingId(null);
    if (res.ok) {
      setProjects((prev) => prev.map((p) => p._id === project._id ? { ...p, published: !project.published } : p));
      showToast("success", project.published ? "Project hidden from home page." : "Project is now visible.");
    } else {
      showToast("error", "Failed to update project.");
    }
  }

  const sorted = [...projects].sort((a, b) => a.order - b.order);
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
            Revert to Default
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

        {/* S3: Ethos */}
        <section className="relative bg-[#f6f2eb] py-36 px-8">
          <EditBadge />
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-[1fr_2fr] gap-16 md:items-start">
              <div className="md:pt-3">
                <div className="h-px w-12 bg-[#c8a96e] mb-6" />
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Our Ethos</p>
              </div>
              <div>
                <h2 ref={r("ethosHeading")} contentEditable suppressContentEditableWarning className={`text-4xl md:text-5xl lg:text-[3.4rem] font-light leading-[1.2] text-[#1f1a17] ${EDIT_LIGHT}`}>
                  {c.ethosHeading}
                </h2>
                <p ref={r("ethosBody")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-[55ch] text-[13.5px] leading-[2] text-[#5a4a3f] ${EDIT_LIGHT}`}>
                  {c.ethosBody}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* S4: Completed Projects Showcase ─ fully interactive, not editable-text */}
        <section className="bg-[#0d0b08] py-16 px-8 border-t border-white/[0.06] pointer-events-auto [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_label]:pointer-events-auto">
          <div className="mx-auto max-w-7xl">

            {/* Section header */}
            <div className="mb-10 flex items-end justify-between">
              <div>
                <div className="h-px w-12 bg-[#c8a96e] mb-4" />
                <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-neutral-500">Our Portfolio</p>
                <p className="text-2xl font-light text-white">Completed Projects</p>
                <p className="mt-1 text-[13px] text-neutral-500">
                  {sorted.filter((p) => p.published).length} visible · {sorted.length} total
                </p>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 bg-[#c8a96e] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0a0806] transition hover:bg-[#b8995e]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
                </svg>
                Add Project
              </button>
            </div>

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded border-2 border-dashed border-neutral-700 py-24">
                <p className="text-[13px] text-neutral-500">No showcase projects yet.</p>
                <button
                  onClick={() => setAddOpen(true)}
                  className="mt-4 text-[12px] font-semibold text-[#c8a96e] underline underline-offset-2 transition hover:text-[#b8995e]"
                >
                  Add your first project →
                </button>
              </div>
            ) : (
              <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((project) => (
                  <div
                    key={project._id}
                    className={`group relative overflow-hidden border bg-[#0f0c0a] ${project.published ? "border-neutral-700" : "border-neutral-700/40 opacity-60"}`}
                  >
                    {!project.published && (
                      <div className="absolute inset-x-0 top-0 z-10 bg-red-900/80 py-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
                        Hidden from home page
                      </div>
                    )}
                    {/* Image */}
                    <div className={`relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 ${!project.published ? "mt-6" : ""}`}>
                      {project.image ? (
                        <img src={project.image} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-600">No image</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <p className="mb-1 text-[9px] uppercase tracking-[0.26em] text-[#c8a96e]/50">Completed</p>
                      <h3 className="mb-1 text-xl font-light text-white">{project.name}</h3>
                      <p className="text-[12px] uppercase tracking-[0.14em] text-neutral-500">{project.address}</p>
                    </div>
                    {/* Hover actions */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="flex items-center gap-1.5 rounded bg-neutral-700/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-200 transition hover:bg-neutral-600"
                      >
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => togglePublish(project)}
                        disabled={togglingId === project._id}
                        className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition disabled:opacity-50 ${project.published ? "bg-yellow-900/80 text-yellow-300 hover:bg-yellow-800" : "bg-green-900/80 text-green-300 hover:bg-green-800"}`}
                      >
                        {togglingId === project._id ? "…" : project.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        disabled={deletingId === project._id}
                        className="flex items-center gap-1.5 rounded bg-red-900/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-300 transition hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === project._id ? "…" : (
                          <>
                            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.559a.75.75 0 1 0-1.492.12l.66 8.25A1.75 1.75 0 0 0 5.405 16.5h5.19a1.75 1.75 0 0 0 1.741-1.57l.66-8.25a.75.75 0 1 0-1.492-.12l-.66 8.25a.25.25 0 0 1-.249.224H5.405a.25.25 0 0 1-.249-.224l-.66-8.25Z" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* S5: Services Grid */}
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
                  <p ref={r(lf)} contentEditable suppressContentEditableWarning className={`text-[1.9rem] font-light leading-none mb-2 text-neutral-200 ${EDIT_DARK}`}>
                    {c[lf]}
                  </p>
                  <p ref={r(sf)} contentEditable suppressContentEditableWarning className={`text-[10px] uppercase tracking-[0.18em] mb-4 text-[#6b5e54] ${EDIT_DARK}`}>
                    {c[sf]}
                  </p>
                  {hasDesc && df && (
                    <p ref={r(df)} contentEditable suppressContentEditableWarning className={`text-[12.5px] leading-[1.85] text-[#5a4f47] ${EDIT_DARK}`}>
                      {c[df]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S6: CTA */}
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

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {addOpen && (
        <ShowcaseModal
          title="Add Project"
          initial={{ name: "", address: "", image: "", published: true }}
          onClose={() => setAddOpen(false)}
          onSave={addProject}
        />
      )}
      {editingProject && (
        <ShowcaseModal
          title="Save Changes"
          initial={{ name: editingProject.name, address: editingProject.address, image: editingProject.image, published: editingProject.published }}
          onClose={() => setEditingProject(null)}
          onSave={(data) => updateProject(editingProject._id, data)}
        />
      )}

      {/* Revert confirmation */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Revert to default</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will reset all text back to the original defaults and overwrite any saved changes. Projects are not affected. This cannot be undone.
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
