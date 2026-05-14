"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type VipSection = {
  heading: string;
  body: string;
};

type VipFormData = {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  category: string;
  image: string;
  status: "draft" | "published";
  content: VipSection[];
};

type ValidationErrors = Partial<
  Record<"title" | "slug" | "description" | "publishDate" | "content", string>
>;

type Toast = { type: "success" | "error"; message: string } | null;

const emptySection: VipSection = { heading: "", body: "" };

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(form: VipFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.title.trim()) errors.title = "Title is required.";

  if (form.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim()))
    errors.slug = "Slug can only use lowercase letters, numbers, and hyphens.";

  if (!form.description.trim()) errors.description = "Description is required.";

  if (!form.publishDate) errors.publishDate = "Publish date is required.";

  if (!form.content.some((s) => s.body.trim().length > 0))
    errors.content = "At least one body section is required.";

  return errors;
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[12px] font-medium text-red-600">{message}</p>;
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </span>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className="fixed left-1/2 top-6 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-4 shadow-2xl ${ok ? "border-green-200" : "border-red-200"}`}
      >
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {ok ? "✓" : "!"}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${ok ? "text-green-800" : "text-red-800"}`}>
            {ok ? "Success" : "Error"}
          </p>
          <p className="mt-1 text-sm leading-5 text-neutral-600">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-sm font-semibold text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function VipForm({ initialData }: { initialData?: Partial<VipFormData> }) {
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);

  const [form, setForm] = useState<VipFormData>({
    _id: initialData?._id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    publishDate: initialData?.publishDate
      ? new Date(initialData.publishDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    category: initialData?.category || "VIP Insights",
    image: initialData?.image || "",
    status: initialData?.status || "draft",
    content: initialData?.content?.length ? initialData.content : [{ ...emptySection }],
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const errors = useMemo(() => validate(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function updateField(field: keyof VipFormData, value: string) {
    setToast(null);
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !isEditing && !prev.slug.trim()) {
        next.slug = makeSlug(value);
      }
      if (field === "slug" && !isEditing) {
        next.slug = makeSlug(value);
      }
      return next;
    });
  }

  function updateSection(index: number, field: keyof VipSection, value: string) {
    setToast(null);
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }

  function addSection() {
    setForm((prev) => ({ ...prev, content: [...prev.content, { ...emptySection }] }));
  }

  function removeSection(index: number) {
    setForm((prev) => ({ ...prev, content: prev.content.filter((_, i) => i !== index) }));
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed.");
    return data.path as string;
  }

  async function handleMainImageUpload(file?: File) {
    if (!file) return;
    setUploadingMain(true);
    setToast(null);
    try {
      const path = await uploadImage(file);
      updateField("image", path);
      showToast("success", "Main image uploaded successfully.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploadingMain(false);
    }
  }

  async function save(status: "draft" | "published") {
    setTouched({ title: true, slug: true, description: true, publishDate: true, content: true });
    setToast(null);

    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) {
      showToast("error", "Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      status,
      slug: form.slug.trim() || makeSlug(form.title),
      content: form.content.filter((s) => s.body.trim()),
    };

    const url = initialData?._id ? `/api/admin/vip/${initialData._id}` : "/api/admin/vip";

    const res = await fetch(url, {
      method: initialData?._id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      showToast("error", data.error || "Failed to save VIP post.");
      return;
    }

    showToast("success", data.message || "VIP post saved successfully.");

    if (!initialData?._id) {
      router.push(`/admin/dashboard/vip/${data.post._id}`);
    }
  }

  return (
    <>
      <ToastCard toast={toast} onClose={() => setToast(null)} />

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <FieldLabel required>Title</FieldLabel>
              <input
                value={form.title}
                onBlur={() => markTouched("title")}
                onChange={(e) => updateField("title", e.target.value)}
                className={`rounded border px-3 py-2 text-sm outline-none transition ${
                  touched.title && errors.title
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-300 focus:border-amber-400"
                }`}
                placeholder="Understanding Off-the-Plan Property in Melbourne"
              />
              <ErrorText message={touched.title ? errors.title : undefined} />
            </label>

            <label className="grid gap-2">
              <FieldLabel>Slug</FieldLabel>
              <input
                value={form.slug}
                onBlur={() => !isEditing && markTouched("slug")}
                onChange={(e) => !isEditing && updateField("slug", e.target.value)}
                disabled={isEditing}
                className={`rounded border px-3 py-2 text-sm outline-none transition ${
                  isEditing
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
                    : touched.slug && errors.slug
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-300 focus:border-amber-400"
                }`}
                placeholder="understanding-off-the-plan-property"
              />
              {isEditing ? (
                <p className="text-[11px] text-neutral-400">
                  Slug is locked after creation and cannot be changed.
                </p>
              ) : (
                <p className="text-[11px] text-neutral-400">
                  Used in the public URL. Example: /client/vip/{form.slug || "your-vip-slug"}
                </p>
              )}
              <ErrorText message={!isEditing && touched.slug ? errors.slug : undefined} />
            </label>

            <label className="grid gap-2">
              <FieldLabel required>Description</FieldLabel>
              <textarea
                value={form.description}
                onBlur={() => markTouched("description")}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className={`resize-none rounded border px-3 py-2 text-sm outline-none transition ${
                  touched.description && errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-300 focus:border-amber-400"
                }`}
                placeholder="Short summary shown on the VIP content listing page."
              />
              <div className="flex items-center justify-between gap-3">
                <ErrorText message={touched.description ? errors.description : undefined} />
                <p className="ml-auto text-[11px] text-neutral-400">
                  {form.description.trim().length} characters
                </p>
              </div>
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="grid gap-2">
                <FieldLabel required>Publish Date</FieldLabel>
                <input
                  type="date"
                  value={form.publishDate}
                  onBlur={() => markTouched("publishDate")}
                  onChange={(e) => updateField("publishDate", e.target.value)}
                  className={`rounded border px-3 py-2 text-sm outline-none transition ${
                    touched.publishDate && errors.publishDate
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-300 focus:border-amber-400"
                  }`}
                />
                <ErrorText message={touched.publishDate ? errors.publishDate : undefined} />
              </label>

              <label className="grid gap-2">
                <FieldLabel>Category</FieldLabel>
                <input
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="Buyer Guide"
                />
              </label>

              <div className="grid gap-2">
                <FieldLabel>Main Image</FieldLabel>
                <label className="inline-flex cursor-pointer items-center justify-center rounded border border-neutral-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900">
                  {uploadingMain ? "Uploading…" : form.image ? "Replace Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingMain}
                    onChange={(e) => handleMainImageUpload(e.target.files?.[0])}
                  />
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => updateField("image", "")}
                    className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-100"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {form.image && (
              <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                <img src={form.image} alt="" className="h-56 w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">VIP Content Body</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Add headings, body text, and optional images. At least one body section is required.
              </p>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="rounded border border-neutral-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
            >
              Add Section
            </button>
          </div>

          {touched.content && errors.content && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errors.content}
            </div>
          )}

          <div className="mt-6 space-y-5">
            {form.content.map((section, index) => (
              <div
                key={index}
                className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Section {index + 1}
                  </p>
                  {form.content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label className="mt-4 grid gap-2">
                  <FieldLabel>Heading</FieldLabel>
                  <input
                    value={section.heading}
                    onChange={(e) => updateSection(index, "heading", e.target.value)}
                    className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                    placeholder="Optional section heading"
                  />
                </label>

                <label className="mt-4 grid gap-2">
                  <FieldLabel required>Body</FieldLabel>
                  <textarea
                    value={section.body}
                    onBlur={() => markTouched("content")}
                    onChange={(e) => updateSection(index, "body", e.target.value)}
                    rows={7}
                    className={`resize-none rounded border bg-white px-3 py-2 text-sm outline-none transition ${
                      touched.content && !section.body.trim()
                        ? "border-red-200"
                        : "border-neutral-300 focus:border-amber-400"
                    }`}
                    placeholder="Write the VIP content here."
                  />
                </label>

              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
          <div>
            <p className={`text-[12px] font-medium ${hasErrors ? "text-red-600" : "text-green-700"}`}>
              {hasErrors
                ? "Some required fields still need attention."
                : "VIP post is ready to save."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={saving}
              className="rounded border border-neutral-200 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-400 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => save("published")}
              disabled={saving}
              className="rounded border border-[#5f5245] bg-[#2f2a24] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17] disabled:opacity-50"
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
