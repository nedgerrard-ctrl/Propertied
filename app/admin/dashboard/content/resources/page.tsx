"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  resourcesDefaults,
  ResourcesContentData,
  ResourceSection,
  ResourceItem,
} from "@/lib/resources-defaults";

// ── Style constants ────────────────────────────────────────────────────────────
const EDIT_DARK =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

const inputBase =
  "w-full rounded border px-3 py-2 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none transition-colors";
const inputNormal = `${inputBase} border-neutral-200 focus:border-amber-400`;
const labelCls =
  "block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1";

type HeroField = "heroHeadingMain" | "heroHeadingAccent" | "heroSubtext";

// ── Helpers ────────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function blankItem(): ResourceItem {
  return { id: uid(), label: "", fileUrl: "", fileName: "" };
}

function blankSection(): ResourceSection {
  return { id: uid(), heading: "New Section", items: [] };
}

function uploadKey(sectionId: string, itemId: string) {
  return `${sectionId}:${itemId}`;
}

async function uploadDocToCloudinary(
  file: File
): Promise<{ path: string; fileName: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload-doc", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return { path: data.path as string, fileName: data.fileName as string };
}

// ── File badge ─────────────────────────────────────────────────────────────────
function FileBadge({ fileName, fileUrl }: { fileName: string; fileUrl: string }) {
  return (
    <div className="flex items-center gap-2 rounded border border-green-200 bg-green-50 px-3 py-2">
      <svg
        className="h-4 w-4 shrink-0 text-green-600"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M4 1.5A1.5 1.5 0 0 1 5.5 0h5.586a.5.5 0 0 1 .353.146l2.415 2.415A.5.5 0 0 1 14 3h-2.5a2 2 0 0 1-2-2V1H5.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 1-1 0v-1Zm8 2h-1.5a1 1 0 0 0-1 1v1.5L12 4.5ZM3 3.5a.5.5 0 0 0-1 0V14a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V5.5h-2A1.5 1.5 0 0 1 9.5 4V2H4a1 1 0 0 0-1 1v.5Z" />
      </svg>
      <span className="flex-1 truncate text-[11px] font-medium text-green-700">
        {fileName || "Uploaded"}
      </span>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-green-600 transition hover:text-green-800"
      >
        Test ↗
      </a>
    </div>
  );
}

// ── Resource item row editor ───────────────────────────────────────────────────
function ResourceItemEditor({
  item,
  index,
  total,
  sectionId,
  uploading,
  uploadError,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onFileUpload,
  onFileRemove,
}: {
  item:         ResourceItem;
  index:        number;
  total:        number;
  sectionId:    string;
  uploading:    boolean;
  uploadError:  string | null;
  onChange:     (sectionId: string, itemId: string, field: keyof ResourceItem, value: string) => void;
  onRemove:     (sectionId: string, itemId: string) => void;
  onMoveUp:     (sectionId: string, index: number) => void;
  onMoveDown:   (sectionId: string, index: number) => void;
  onFileUpload: (sectionId: string, itemId: string, file: File) => void;
  onFileRemove: (sectionId: string, itemId: string) => void;
}) {
  const hasFile = !!item.fileUrl;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-3 py-2">
        {/* Reorder */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMoveUp(sectionId, index)}
            disabled={index === 0}
            title="Move up"
            className="rounded p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4l-5 5h10L8 4z" />
            </svg>
          </button>
          <button
            onClick={() => onMoveDown(sectionId, index)}
            disabled={index === total - 1}
            title="Move down"
            className="rounded p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12l5-5H3l5 5z" />
            </svg>
          </button>
        </div>

        <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Item {index + 1}
        </span>

        <button
          onClick={() => onRemove(sectionId, item.id)}
          className="rounded px-2 py-0.5 text-[10px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-2">
        {/* Label */}
        <div>
          <label className={labelCls}>Label</label>
          <input
            className={inputNormal}
            value={item.label}
            placeholder="e.g. Residential Rental Application Form"
            onChange={(e) => onChange(sectionId, item.id, "label", e.target.value)}
          />
        </div>

        {/* File upload */}
        <div>
          <label className={labelCls}>File</label>

          {hasFile ? (
            <div className="space-y-2">
              <FileBadge fileName={item.fileName} fileUrl={item.fileUrl} />
              <div className="flex gap-2">
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
                    "Replace File"
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileUpload(sectionId, item.id, file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onFileRemove(sectionId, item.id)}
                  className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-500 transition hover:bg-red-100 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div>
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
                    Upload File
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileUpload(sectionId, item.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="mt-1 text-[10px] text-neutral-400">
                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX · max 20 MB
              </p>
            </div>
          )}

          {uploadError && (
            <p className="mt-1.5 text-[11px] font-medium text-red-600">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section editor ─────────────────────────────────────────────────────────────
function ResourceSectionEditor({
  section,
  index,
  total,
  uploadingIds,
  uploadErrors,
  onHeadingChange,
  onAddItem,
  onRemoveSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onItemChange,
  onRemoveItem,
  onMoveItemUp,
  onMoveItemDown,
  onFileUpload,
  onFileRemove,
}: {
  section:            ResourceSection;
  index:              number;
  total:              number;
  uploadingIds:       Set<string>;
  uploadErrors:       Record<string, string>;
  onHeadingChange:    (sectionId: string, value: string) => void;
  onAddItem:          (sectionId: string) => void;
  onRemoveSection:    (sectionId: string) => void;
  onMoveSectionUp:    (index: number) => void;
  onMoveSectionDown:  (index: number) => void;
  onItemChange:       (sectionId: string, itemId: string, field: keyof ResourceItem, value: string) => void;
  onRemoveItem:       (sectionId: string, itemId: string) => void;
  onMoveItemUp:       (sectionId: string, index: number) => void;
  onMoveItemDown:     (sectionId: string, index: number) => void;
  onFileUpload:       (sectionId: string, itemId: string, file: File) => void;
  onFileRemove:       (sectionId: string, itemId: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onMoveSectionUp(index)}
              disabled={index === 0}
              title="Move section up"
              className="rounded p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4l-5 5h10L8 4z" />
              </svg>
            </button>
            <button
              onClick={() => onMoveSectionDown(index)}
              disabled={index === total - 1}
              title="Move section down"
              className="rounded p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12l5-5H3l5 5z" />
              </svg>
            </button>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            Section {index + 1}
          </span>
        </div>
        <button
          onClick={() => onRemoveSection(section.id)}
          className="rounded px-2 py-1 text-[11px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
        >
          Remove Section
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Heading input */}
        <div>
          <label className={labelCls}>Section Heading</label>
          <input
            className={inputNormal}
            value={section.heading}
            placeholder="e.g. For Tenants"
            onChange={(e) => onHeadingChange(section.id, e.target.value)}
          />
        </div>

        {/* Items */}
        {section.items.length > 0 && (
          <div className="space-y-3">
            {section.items.map((item, i) => {
              const key = uploadKey(section.id, item.id);
              return (
                <ResourceItemEditor
                  key={item.id}
                  item={item}
                  index={i}
                  total={section.items.length}
                  sectionId={section.id}
                  uploading={uploadingIds.has(key)}
                  uploadError={uploadErrors[key] ?? null}
                  onChange={onItemChange}
                  onRemove={onRemoveItem}
                  onMoveUp={onMoveItemUp}
                  onMoveDown={onMoveItemDown}
                  onFileUpload={onFileUpload}
                  onFileRemove={onFileRemove}
                />
              );
            })}
          </div>
        )}

        {section.items.length === 0 && (
          <p className="text-center text-[12px] text-neutral-400 italic py-2">
            No items yet — add one below.
          </p>
        )}

        {/* Add item */}
        <button
          onClick={() => onAddItem(section.id)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 transition hover:border-[#c8a96e] hover:text-[#c8a96e]"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
          </svg>
          Add Item to this Section
        </button>
      </div>
    </div>
  );
}

// ── Main editor ────────────────────────────────────────────────────────────────
export default function ResourcesInlineEditor() {
  const [heroContent, setHeroContent] = useState({
    heroHeadingMain:   resourcesDefaults.heroHeadingMain,
    heroHeadingAccent: resourcesDefaults.heroHeadingAccent,
    heroSubtext:       resourcesDefaults.heroSubtext,
  });
  const [sections,    setSections]    = useState<ResourceSection[]>(resourcesDefaults.sections);
  const [footerNote,  setFooterNote]  = useState(resourcesDefaults.footerNote);
  const [footerEmail, setFooterEmail] = useState(resourcesDefaults.footerEmail);
  const [lastSaved,   setLastSaved]   = useState<ResourcesContentData>(resourcesDefaults);

  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [revertOpen,  setRevertOpen]  = useState(false);

  // Per-item upload state, keyed by `${sectionId}:${itemId}`
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const heroRefs = useRef<Partial<Record<HeroField, HTMLElement | null>>>({});

  function rh(field: HeroField) {
    return (el: HTMLElement | null) => { heroRefs.current[field] = el; };
  }

  useEffect(() => {
    fetch("/api/admin/content/resources")
      .then((r) => r.json())
      .then((data: ResourcesContentData) => {
        setHeroContent({
          heroHeadingMain:   data.heroHeadingMain,
          heroHeadingAccent: data.heroHeadingAccent,
          heroSubtext:       data.heroSubtext,
        });
        setSections(data.sections);
        setFooterNote(data.footerNote);
        setFooterEmail(data.footerEmail);
        setLastSaved(data);
        setLoading(false);
      });
  }, []);

  // ── Section handlers ───────────────────────────────────────────────────────
  function handleHeadingChange(sectionId: string, value: string) {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, heading: value } : s)
    );
    setSaved(false);
  }

  function handleAddSection() {
    setSections((prev) => [...prev, blankSection()]);
    setSaved(false);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  }

  function handleRemoveSection(sectionId: string) {
    if (!confirm("Remove this entire section and all its items?")) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSaved(false);
  }

  function handleMoveSectionUp(index: number) {
    if (index === 0) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSaved(false);
  }

  function handleMoveSectionDown(index: number) {
    setSections((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setSaved(false);
  }

  // ── Item handlers ──────────────────────────────────────────────────────────
  function handleAddItem(sectionId: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, blankItem()] } : s
      )
    );
    setSaved(false);
  }

  function handleItemChange(
    sectionId: string,
    itemId: string,
    field: keyof ResourceItem,
    value: string
  ) {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, items: s.items.map((it) => it.id === itemId ? { ...it, [field]: value } : it) }
      )
    );
    setSaved(false);
  }

  function handleRemoveItem(sectionId: string, itemId: string) {
    if (!confirm("Remove this item?")) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : { ...s, items: s.items.filter((it) => it.id !== itemId) }
      )
    );
    setSaved(false);
  }

  function handleMoveItemUp(sectionId: string, index: number) {
    if (index === 0) return;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const items = [...s.items];
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
        return { ...s, items };
      })
    );
    setSaved(false);
  }

  function handleMoveItemDown(sectionId: string, index: number) {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        if (index >= s.items.length - 1) return s;
        const items = [...s.items];
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
        return { ...s, items };
      })
    );
    setSaved(false);
  }

  // ── File upload handlers ───────────────────────────────────────────────────
  async function handleFileUpload(sectionId: string, itemId: string, file: File) {
    const key = uploadKey(sectionId, itemId);
    setUploadingIds((prev) => new Set(prev).add(key));
    setUploadErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

    try {
      const { path, fileName } = await uploadDocToCloudinary(file);
      setSections((prev) =>
        prev.map((s) =>
          s.id !== sectionId
            ? s
            : { ...s, items: s.items.map((it) => it.id === itemId ? { ...it, fileUrl: path, fileName } : it) }
        )
      );
      setSaved(false);
    } catch (err) {
      setUploadErrors((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : "Upload failed.",
      }));
    } finally {
      setUploadingIds((prev) => { const n = new Set(prev); n.delete(key); return n; });
    }
  }

  function handleFileRemove(sectionId: string, itemId: string) {
    const key = uploadKey(sectionId, itemId);
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, items: s.items.map((it) => it.id === itemId ? { ...it, fileUrl: "", fileName: "" } : it) }
      )
    );
    setUploadErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    setSaved(false);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function save() {
    const heroUpdates = {
      heroHeadingMain:   heroRefs.current.heroHeadingMain?.innerText.trim()   || heroContent.heroHeadingMain,
      heroHeadingAccent: heroRefs.current.heroHeadingAccent?.innerText.trim() || heroContent.heroHeadingAccent,
      heroSubtext:       heroRefs.current.heroSubtext?.innerText.trim()       || heroContent.heroSubtext,
    };

    setSaving(true);
    const res = await fetch("/api/admin/content/resources", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...heroUpdates, sections, footerNote, footerEmail }),
    });
    setSaving(false);
    if (res.ok) {
      setHeroContent(heroUpdates);
      setLastSaved({ ...heroUpdates, sections, footerNote, footerEmail });
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  // ── Revert ─────────────────────────────────────────────────────────────────
  async function confirmRevert() {
    setRevertOpen(false);
    const fields: HeroField[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    for (const f of fields) {
      const el = heroRefs.current[f];
      if (el) el.innerText = lastSaved[f];
    }
    setHeroContent({
      heroHeadingMain:   lastSaved.heroHeadingMain,
      heroHeadingAccent: lastSaved.heroHeadingAccent,
      heroSubtext:       lastSaved.heroSubtext,
    });
    setSections(lastSaved.sections);
    setFooterNote(lastSaved.footerNote);
    setFooterEmail(lastSaved.footerEmail);
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
              Edit Mode — Resources
            </p>
          </div>
          {anyUploading && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-black/60">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Uploading…
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
            href="/resources"
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
        {/* ── Hero preview (contentEditable) ──────────────────────────────── */}
        <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden [&_a]:pointer-events-none [&_a]:cursor-default">
          <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black shadow select-none z-20">
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            Editable
          </span>
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">PPM</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
                Forms &amp; Documents
              </p>
            </div>
            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
                <span
                  ref={rh("heroHeadingMain")}
                  contentEditable
                  suppressContentEditableWarning
                  className={EDIT_DARK}
                  onInput={() => setSaved(false)}
                >
                  {heroContent.heroHeadingMain}
                </span>
                {" "}
                <span className={`text-[#c8a96e] ${EDIT_DARK}`}>
                  <span
                    ref={rh("heroHeadingAccent")}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => setSaved(false)}
                  >
                    {heroContent.heroHeadingAccent}
                  </span>
                </span>
              </h1>
            </div>
            <p
              ref={rh("heroSubtext")}
              contentEditable
              suppressContentEditableWarning
              className={`mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}
              onInput={() => setSaved(false)}
            >
              {heroContent.heroSubtext}
            </p>
          </div>
        </section>

        {/* ── Sections editor ──────────────────────────────────────────────── */}
        <section className="bg-neutral-100 py-16">
          <div className="mx-auto max-w-5xl px-6 space-y-6">

            {/* Section header */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Resource Sections
                </p>
                <p className="mt-1 text-[12px] text-neutral-400">
                  Upload a file for each item, then click{" "}
                  <strong className="font-semibold text-neutral-600">Save Changes</strong>.
                </p>
              </div>
              <button
                onClick={handleAddSection}
                className="flex items-center gap-2 rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
                </svg>
                Add Section
              </button>
            </div>

            {/* Section editors */}
            {sections.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-neutral-300 py-16 text-center">
                <p className="text-[13px] text-neutral-400">No sections yet.</p>
                <button
                  onClick={handleAddSection}
                  className="mt-4 rounded border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#1f1a17]"
                >
                  + Add First Section
                </button>
              </div>
            ) : (
              sections.map((section, i) => (
                <ResourceSectionEditor
                  key={section.id}
                  section={section}
                  index={i}
                  total={sections.length}
                  uploadingIds={uploadingIds}
                  uploadErrors={uploadErrors}
                  onHeadingChange={handleHeadingChange}
                  onAddItem={handleAddItem}
                  onRemoveSection={handleRemoveSection}
                  onMoveSectionUp={handleMoveSectionUp}
                  onMoveSectionDown={handleMoveSectionDown}
                  onItemChange={handleItemChange}
                  onRemoveItem={handleRemoveItem}
                  onMoveItemUp={handleMoveItemUp}
                  onMoveItemDown={handleMoveItemDown}
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleFileRemove}
                />
              ))
            )}

            {/* Footer note + email fields */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700">
                Footer Contact Note
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Note Text</label>
                  <input
                    className={`${inputBase} border-amber-200 bg-white focus:border-amber-500`}
                    value={footerNote}
                    placeholder="To request a form not listed above, contact"
                    onChange={(e) => { setFooterNote(e.target.value); setSaved(false); }}
                  />
                </div>
                <div>
                  <label className={labelCls}>Contact Email</label>
                  <input
                    className={`${inputBase} border-amber-200 bg-white focus:border-amber-500`}
                    value={footerEmail}
                    placeholder="admin@onlinepropertyservices.com.au"
                    onChange={(e) => { setFooterEmail(e.target.value); setSaved(false); }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
              <strong>Remember:</strong> files upload instantly to Cloudinary, but click{" "}
              <strong>Save Changes</strong> in the toolbar to persist all labels and section details.
            </div>
          </div>
        </section>
      </div>

      {/* ── Revert modal ────────────────────────────────────────────────────── */}
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
