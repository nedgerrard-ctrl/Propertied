"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { testimonialDefaults, TestimonialContentData } from "@/lib/testimonial-defaults";

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.path as string;
}

type TextField = "cine1Quote" | "cine1Client" | "cine2Quote" | "cine2Client" | "cine3Quote" | "cine3Client" | "ctaHeading";

type DynamicTestimonial = {
  _id: string;
  quote: string;
  client: string;
  rating: number;
  image?: string;
};

type ToastData = { type: "success" | "error"; message: string } | null;

type TestimonialDraft = { quote?: string; client?: string; image?: string };

const EDIT_DARK = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

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

// ── Toast notification ─────────────────────────────────────────────────────────

function Toast({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-20 left-1/2 z-[300] -translate-x-1/2 flex w-full max-w-sm items-center gap-3 rounded-xl px-5 py-4 shadow-2xl ${
        toast.type === "success" ? "bg-green-600" : "bg-red-600"
      } text-white`}
    >
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
      <button onClick={onClose} className="text-white/70 hover:text-white transition text-xl leading-none">
        ×
      </button>
    </div>
  );
}


const cinematicItems = [
  { quoteField: "cine1Quote" as TextField, clientField: "cine1Client" as TextField, align: "items-start text-left  md:pr-[25%]" },
  { quoteField: "cine2Quote" as TextField, clientField: "cine2Client" as TextField, align: "items-end   text-right md:pl-[25%]" },
  { quoteField: "cine3Quote" as TextField, clientField: "cine3Client" as TextField, align: "items-center text-center px-[5%]" },
];

// ── Add Testimonial Modal ──────────────────────────────────────────────────────

function AddModal({
  onClose, onAdded,
  initialValues = {}, onDraftSaved,
}: {
  onClose: () => void;
  onAdded: (t: DynamicTestimonial) => void;
  initialValues?: TestimonialDraft;
  onDraftSaved: (d: TestimonialDraft) => void;
}) {
  const [quote, setQuote]   = useState(initialValues.quote  ?? "");
  const [client, setClient] = useState(initialValues.client ?? "");
  const [image, setImage]   = useState(initialValues.image  ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const draftRef = useRef({ quote, client, image });
  useEffect(() => { draftRef.current = { quote, client, image }; }, [quote, client, image]);
  useEffect(() => { return () => { onDraftSaved(draftRef.current); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleQuote(v: string) {
    setQuote(v);
    setErrors((p) => ({ ...p, quote: v.trim() ? "" : "Required" }));
  }

  function handleClient(v: string) {
    setClient(v);
    setErrors((p) => ({ ...p, client: v.trim() ? "" : "Required" }));
  }

  async function handleImageFile(file: File) {
    setUploadingImage(true);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const newErrors = {
      quote: quote.trim() ? "" : "Required",
      client: client.trim() ? "" : "Required",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    setSaving(true);
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote: quote.trim(), client: client.trim(), image }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setApiError(data.error || "Failed to add testimonial.");
    } else {
      onDraftSaved({});
      onAdded({ _id: data._id, quote: data.quote, client: data.client, rating: data.rating, image: data.image || undefined });
      onClose();
    }
  }

  const inputBase = "w-full rounded border px-3 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-xl bg-white p-7 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-neutral-900">Add Testimonial</h2>
        <p className="mt-1 text-sm text-neutral-500">Appears in the &ldquo;More Reviews&rdquo; grid on the public page.</p>

        {apiError && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.018 1.49A.75.75 0 0 1 8 .75h.002a.75.75 0 0 1 .75.748v.002l-.112 6.502a.75.75 0 0 1-1.498 0L7.018 1.49ZM8 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
            </svg>
            <p className="text-[12px] font-medium text-red-700">{apiError}</p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Client photo */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-2">
              Client Photo <span className="font-normal normal-case tracking-normal text-neutral-400">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {image ? (
                <img src={image} alt="Client" className="h-12 w-12 rounded-full object-cover ring-2 ring-neutral-200 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-neutral-100 ring-2 ring-neutral-200 shrink-0 flex items-center justify-center">
                  <svg className="h-6 w-6 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700 transition hover:bg-amber-100">
                    {uploadingImage ? "Uploading…" : image ? "Replace Photo" : "Upload Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageFile(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>
              {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1.5">
              Quote *
            </label>
            <textarea
              value={quote}
              onChange={(e) => handleQuote(e.target.value)}
              rows={4}
              placeholder="What the client said…"
              className={`${inputBase} resize-none ${errors.quote ? "border-red-400 bg-red-50/30 focus:border-red-500" : "border-neutral-200 focus:border-amber-400"}`}
            />
            {errors.quote && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.quote}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1.5">
              Client Name *
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => handleClient(e.target.value)}
              placeholder="e.g. Sarah T. — Property Investor"
              className={`${inputBase} ${errors.client ? "border-red-400 bg-red-50/30 focus:border-red-500" : "border-neutral-200 focus:border-amber-400"}`}
            />
            {errors.client && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.client}</p>}
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
            disabled={saving || uploadingImage}
            className="rounded bg-amber-400 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300 disabled:opacity-50"
          >
            {saving ? "Adding…" : "Add Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Edit Testimonial Modal ─────────────────────────────────────────────────────

function EditModal({
  testimonial,
  onClose,
  onUpdated,
}: {
  testimonial: DynamicTestimonial;
  onClose: () => void;
  onUpdated: (t: DynamicTestimonial) => void;
}) {
  const [quote, setQuote]   = useState(testimonial.quote);
  const [client, setClient] = useState(testimonial.client);
  const [image, setImage]   = useState(testimonial.image ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleImageFile(file: File) {
    setUploadingImage(true);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const newErrors = {
      quote: quote.trim() ? "" : "Required",
      client: client.trim() ? "" : "Required",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) return;

    setSaving(true);
    const res = await fetch(`/api/admin/testimonials/${testimonial._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote: quote.trim(), client: client.trim(), image }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setApiError(data.error || "Failed to update testimonial.");
    } else {
      onUpdated({ ...testimonial, quote: data.quote, client: data.client, image: data.image || undefined });
      onClose();
    }
  }

  const inputBase = "w-full rounded border px-3 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-xl bg-white p-7 shadow-2xl">
        <h2 className="text-lg font-semibold text-neutral-900">Edit Testimonial</h2>
        <p className="mt-1 text-sm text-neutral-500">Changes apply immediately to the public page.</p>

        {apiError && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.018 1.49A.75.75 0 0 1 8 .75h.002a.75.75 0 0 1 .75.748v.002l-.112 6.502a.75.75 0 0 1-1.498 0L7.018 1.49ZM8 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
            </svg>
            <p className="text-[12px] font-medium text-red-700">{apiError}</p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Client photo */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-2">
              Client Photo <span className="font-normal normal-case tracking-normal text-neutral-400">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {image ? (
                <img src={image} alt="Client" className="h-12 w-12 rounded-full object-cover ring-2 ring-neutral-200 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-neutral-100 ring-2 ring-neutral-200 shrink-0 flex items-center justify-center">
                  <svg className="h-6 w-6 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700 transition hover:bg-amber-100">
                    {uploadingImage ? "Uploading…" : image ? "Replace Photo" : "Upload Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageFile(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>
              {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1.5">
              Quote *
            </label>
            <textarea
              value={quote}
              onChange={(e) => { setQuote(e.target.value); setErrors((p) => ({ ...p, quote: e.target.value.trim() ? "" : "Required" })); }}
              rows={4}
              placeholder="What the client said…"
              className={`${inputBase} resize-none ${errors.quote ? "border-red-400 bg-red-50/30 focus:border-red-500" : "border-neutral-200 focus:border-amber-400"}`}
            />
            {errors.quote && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.quote}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1.5">
              Client Name *
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => { setClient(e.target.value); setErrors((p) => ({ ...p, client: e.target.value.trim() ? "" : "Required" })); }}
              placeholder="e.g. Sarah T. — Property Investor"
              className={`${inputBase} ${errors.client ? "border-red-400 bg-red-50/30 focus:border-red-500" : "border-neutral-200 focus:border-amber-400"}`}
            />
            {errors.client && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.client}</p>}
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
            disabled={saving || uploadingImage}
            className="rounded bg-amber-400 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export default function TestimonialInlineEditor() {
  const [content, setContent]       = useState<TestimonialContentData>(testimonialDefaults);
  const [lastSaved, setLastSaved]   = useState<TestimonialContentData>(testimonialDefaults);
  const [testimonials, setTestimonials] = useState<DynamicTestimonial[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const [addOpen, setAddOpen]             = useState(false);
  const [addDraft, setAddDraft]           = useState<TestimonialDraft>({});
  const [editingTestimonial, setEditingTestimonial] = useState<DynamicTestimonial | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [toast, setToast]           = useState<ToastData>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refs = useRef<Partial<Record<TextField, HTMLElement | null>>>({});

  function showToast(type: "success" | "error", message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  const fetchTestimonials = useCallback(async () => {
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) setTestimonials(await res.json());
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/content/testimonial").then((r) => r.json()),
      fetch("/api/admin/testimonials").then((r) => r.json()),
    ]).then(([cmsData, dynamicData]) => {
      setContent((prev) => ({ ...prev, ...cmsData }));
      setLastSaved((prev) => ({ ...prev, ...cmsData }));
      setTestimonials(dynamicData);
      setLoading(false);
    });
  }, []);

  // suppress unused warning — fetchTestimonials kept for future use
  void fetchTestimonials;

  function r(field: TextField) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  async function confirmRevert() {
    setRevertOpen(false);
    for (const [field, el] of Object.entries(refs.current) as [TextField, HTMLElement | null][]) {
      if (el && field in lastSaved) {
        el.innerText = lastSaved[field as keyof typeof lastSaved] as string;
      }
    }
    setContent(lastSaved);
    showToast("success", "Changes discarded.");
  }

  async function save() {
    const updates: Partial<Record<TextField, string>> = {};
    for (const [key, el] of Object.entries(refs.current) as [TextField, HTMLElement | null][]) {
      if (el) updates[key] = el.innerText.trim();
    }
    setSaving(true);
    const res = await fetch("/api/admin/content/testimonial", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    if (res.ok) {
      setContent((prev) => ({ ...prev, ...updates }));
      setLastSaved((prev) => ({ ...prev, ...updates }));
      showToast("success", "Changes saved successfully.");
    } else {
      const data = await res.json().catch(() => ({}));
      showToast("error", data.error || "Failed to save changes.");
    }
  }

  async function deleteTestimonial(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      showToast("success", "Testimonial deleted.");
    } else {
      showToast("error", "Failed to delete testimonial.");
    }
  }

  function updateTestimonial(updated: DynamicTestimonial) {
    setTestimonials((prev) => prev.map((t) => t._id === updated._id ? updated : t));
    showToast("success", "Testimonial updated.");
  }

  const c = content;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Admin toolbar ──────────────────────────────────────────────────── */}
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
              Edit Mode — Testimonials
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-black/50">· Click any underlined text to edit</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/testimonial"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70 transition hover:border-black/60 hover:text-black"
          >
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

      {/* ── Page render ────────────────────────────────────────────────────── */}
      <main className="min-h-screen w-full pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Cinematic quotes */}
        <section className="relative bg-[#1e1a15] pb-20">
          <EditBadge />
          {cinematicItems.map(({ quoteField, clientField, align }, index) => (
            <div key={quoteField} className={`min-h-[85vh] flex flex-col justify-center w-full max-w-7xl mx-auto px-8 md:px-14 ${align}`}>
              <div className="max-w-3xl">
                <p className="text-[5rem] leading-none text-[#c8a96e] select-none -mb-3" aria-hidden="true">&ldquo;</p>
                <h2 className="text-3xl md:text-5xl lg:text-[3.4rem] text-neutral-100 leading-[1.25] tracking-tight font-light">
                  <span ref={r(quoteField)} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                    {c[quoteField]}
                  </span>
                </h2>
                <p className="mt-8 text-[11px] tracking-[0.28em] text-[#8a7b6d] uppercase">
                  —{" "}
                  <span ref={r(clientField)} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                    {c[clientField]}
                  </span>
                </p>
                <p className="mt-3 text-[10px] text-[#4a3f37] uppercase tracking-[0.2em]">Quote {index + 1} of 3</p>
              </div>
            </div>
          ))}
        </section>

        {/* S2: Dynamic testimonials management */}
        <section className="bg-[#f6f2eb] border-t border-[#e3d8ca] py-16">
          <div className="max-w-7xl mx-auto px-8 md:px-14">

            {/* Header row */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-[#8a7b6d] uppercase">More Reviews</p>
                <p className="mt-1 text-[13px] text-[#5b5147]">
                  {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""} · appear in the grid on the public page
                </p>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 bg-[#2f2a24] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z"/>
                </svg>
                Add Testimonial
              </button>
            </div>

            {/* Grid */}
            {testimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#ddd3c6] rounded">
                <p className="text-[13px] text-[#8a7b6d]">No testimonials yet.</p>
                <button
                  onClick={() => setAddOpen(true)}
                  className="mt-4 text-[12px] font-semibold text-[#c8a96e] underline underline-offset-2 transition hover:text-[#a8894e]"
                >
                  Add your first testimonial →
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                {testimonials.map((t) => (
                  <div key={t._id} className="relative border border-[#e3d8ca] bg-white p-6 group">
                    {/* Photo row */}
                    <div className="mb-3">
                      {t.image ? (
                        <img src={t.image} alt={t.client} className="h-9 w-9 rounded-full object-cover ring-1 ring-[#e3d8ca]" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-[#f0ebe4] ring-1 ring-[#e3d8ca] flex items-center justify-center">
                          <svg className="h-4 w-4 text-[#c8bfb4]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-[13px] italic text-[#2a1f1a] leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="mt-4 text-[10px] tracking-[0.22em] text-[#8a7b6d] uppercase">{t.client}</p>

                    {/* Edit / Delete buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setEditingTestimonial(t)}
                        className="flex items-center gap-1 rounded bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 transition hover:bg-amber-100"
                        title="Edit this testimonial"
                      >
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTestimonial(t._id)}
                        disabled={deletingId === t._id}
                        className="flex items-center gap-1 rounded bg-red-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                        title="Delete this testimonial"
                      >
                        {deletingId === t._id ? (
                          "Deleting…"
                        ) : (
                          <>
                            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.559a.75.75 0 1 0-1.492.12l.66 8.25A1.75 1.75 0 0 0 5.405 16.5h5.19a1.75 1.75 0 0 0 1.741-1.57l.66-8.25a.75.75 0 1 0-1.492-.12l-.66 8.25a.25.25 0 0 1-.249.224H5.405a.25.25 0 0 1-.249-.224l-.66-8.25Z"/>
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

        {/* S3: CTA */}
        <section className="relative bg-[#2f2a24] border-t border-white/[0.06] py-28">
          <EditBadge />
          <div className="max-w-7xl mx-auto px-8 md:px-14 text-center">
            <p className="text-[10px] tracking-[0.32em] text-[#8a7b6d] uppercase mb-6">Begin Your Journey</p>
            <h2
              ref={r("ctaHeading")}
              contentEditable
              suppressContentEditableWarning
              className={`text-4xl md:text-5xl text-neutral-100 font-light leading-snug mb-10 ${EDIT_DARK}`}
            >
              {c.ctaHeading}
            </h2>
          </div>
        </section>

      </main>

      {/* Add testimonial modal */}
      {addOpen && (
        <AddModal
          onClose={() => setAddOpen(false)}
          initialValues={addDraft}
          onDraftSaved={setAddDraft}
          onAdded={(t) => {
            setTestimonials((prev) => [t, ...prev]);
            showToast("success", "Testimonial added successfully.");
          }}
        />
      )}

      {/* Edit testimonial modal */}
      {editingTestimonial && (
        <EditModal
          testimonial={editingTestimonial}
          onClose={() => setEditingTestimonial(null)}
          onUpdated={updateTestimonial}
        />
      )}

      {/* Revert confirmation modal */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Discard changes</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will undo all unsaved edits and restore the page to the last saved state. Individual testimonials in the grid are not affected.
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
