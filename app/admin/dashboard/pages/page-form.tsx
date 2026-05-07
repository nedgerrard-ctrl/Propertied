"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PageSection = { heading: string; body: string; image: string };

type PageFormData = {
  _id?: string;
  title: string;
  slug: string;
  templateKey: "text-only" | "text-image";
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  body: string;
  sections: PageSection[];
  ctaTitle: string;
  ctaText: string;
  ctaLink: string;
  navLabel: string;
  pageGroup: string;
  statusLabel: string;
  showInNavbar: boolean;
  sortOrder: number;
  featuredImage: string;
};

type ValidationErrors = Partial<
  Record<"title" | "slug" | "body" | "sections", string>
>;

type Toast = { type: "success" | "error"; message: string } | null;

const emptySection: PageSection = { heading: "", body: "", image: "" };

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validatePage(form: PageFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  if (
    form.slug.trim() &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())
  )
    errors.slug =
      "Slug can only use lowercase letters, numbers, and hyphens.";
  if (form.templateKey === "text-only" && !form.body.trim())
    errors.body = "Body content is required.";
  if (form.templateKey === "text-image") {
    const hasBody = form.sections.some((s) => s.body.trim().length > 0);
    if (!hasBody)
      errors.sections =
        "At least one section with body content is required.";
  }
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

function ToastCard({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="fixed left-1/2 top-6 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-4 shadow-2xl ${
          isSuccess ? "border-green-200" : "border-red-200"
        }`}
      >
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isSuccess ? "✓" : "!"}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold ${
              isSuccess ? "text-green-800" : "text-red-800"
            }`}
          >
            {isSuccess ? "Success" : "Error"}
          </p>
          <p className="mt-1 text-sm leading-5 text-neutral-600">
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-sm font-semibold text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function PageForm({
  initialData,
}: {
  initialData?: Partial<PageFormData>;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);

  const [form, setForm] = useState<PageFormData>({
    _id: initialData?._id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    templateKey: initialData?.templateKey || "text-only",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    heroEyebrow: initialData?.heroEyebrow || "",
    heroTitle: initialData?.heroTitle || "",
    heroSummary: initialData?.heroSummary || "",
    body: initialData?.body || "",
    sections: initialData?.sections?.length
      ? initialData.sections
      : [{ ...emptySection }],
    ctaTitle: initialData?.ctaTitle || "",
    ctaText: initialData?.ctaText || "",
    ctaLink: initialData?.ctaLink || "",
    navLabel: initialData?.navLabel || "",
    pageGroup: initialData?.pageGroup || "more",
    statusLabel: initialData?.statusLabel || "",
    showInNavbar: !!initialData?.showInNavbar,
    sortOrder: initialData?.sortOrder || 100,
    featuredImage: initialData?.featuredImage || "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingSectionIndex, setUploadingSectionIndex] = useState<
    number | null
  >(null);
  const [toast, setToast] = useState<Toast>(null);

  const errors = useMemo(() => validatePage(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  function updateField<K extends keyof PageFormData>(
    field: K,
    value: PageFormData[K]
  ) {
    setToast(null);
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !isEditing && !prev.slug.trim()) {
        next.slug = makeSlug(value as string);
      }
      if (field === "slug" && !isEditing) {
        next.slug = makeSlug(value as string);
      }
      return next;
    });
  }

  function updateSection(
    index: number,
    field: keyof PageSection,
    value: string
  ) {
    setToast(null);
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...emptySection }],
    }));
  }

  function removeSection(index: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed.");
    return data.path as string;
  }

  async function handleSectionImageUpload(index: number, file?: File) {
    if (!file) return;
    setUploadingSectionIndex(index);
    setToast(null);
    try {
      const path = await uploadImage(file);
      updateSection(index, "image", path);
      showToast("success", `Section ${index + 1} image uploaded.`);
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploadingSectionIndex(null);
    }
  }

  async function saveToApi(status: "draft" | "published"): Promise<string> {
    const slug = form.slug.trim() || makeSlug(form.title);
    const payload = {
      ...form,
      status,
      slug,
      sections:
        form.templateKey === "text-image"
          ? form.sections.filter((s) => s.body.trim())
          : [],
    };

    const url = form._id
      ? `/api/admin/pages/${form._id}`
      : "/api/admin/pages";
    const method = form._id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save page.");
    return data._id ? String(data._id) : form._id!;
  }

  async function save() {
    setTouched({ title: true, slug: true, body: true, sections: true });
    setToast(null);
    if (Object.keys(validatePage(form)).length > 0) {
      showToast("error", "Please fix the highlighted fields before saving.");
      return;
    }
    setSaving(true);
    try {
      const id = await saveToApi("draft");
      showToast("success", "Draft saved successfully.");
      if (!form._id && id) {
        router.push(`/admin/dashboard/pages/${id}`);
      }
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to save draft."
      );
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setTouched({ title: true, slug: true, body: true, sections: true });
    setToast(null);
    if (Object.keys(validatePage(form)).length > 0) {
      showToast("error", "Please fix the highlighted fields before publishing.");
      return;
    }
    setPublishing(true);
    try {
      const id = await saveToApi("draft");
      const pubRes = await fetch(`/api/admin/pages/${id}/publish`, {
        method: "POST",
      });
      const pubData = await pubRes.json();
      if (!pubRes.ok)
        throw new Error(pubData.error || "Failed to publish page.");
      showToast("success", "Page published successfully.");
      if (!form._id && id) {
        router.push(`/admin/dashboard/pages/${id}`);
      }
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to publish page."
      );
    } finally {
      setPublishing(false);
    }
  }

  const isBusy = saving || publishing;

  return (
    <>
      <ToastCard toast={toast} onClose={() => setToast(null)} />

      <div className="mt-8 space-y-6">
        {/* Template selector — only when creating */}
        {!isEditing ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">
                Choose a Template
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Select the layout for this page. This cannot be changed after
                saving.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updateField("templateKey", "text-only")}
                className={`rounded-lg border-2 p-5 text-left transition ${
                  form.templateKey === "text-only"
                    ? "border-[#2f2a24] bg-[#2f2a24]/5"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div
                  className={`mb-3 h-1.5 w-8 rounded ${
                    form.templateKey === "text-only"
                      ? "bg-[#c8a96e]"
                      : "bg-neutral-300"
                  }`}
                />
                <p className="font-semibold text-neutral-900">Text Only</p>
                <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">
                  Hero section followed by flowing body paragraphs and an
                  optional call-to-action. Matches the developer page layout.
                </p>
                {form.templateKey === "text-only" && (
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2f2a24]">
                    Selected
                  </p>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateField("templateKey", "text-image")}
                className={`rounded-lg border-2 p-5 text-left transition ${
                  form.templateKey === "text-image"
                    ? "border-[#2f2a24] bg-[#2f2a24]/5"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div
                  className={`mb-3 h-1.5 w-8 rounded ${
                    form.templateKey === "text-image"
                      ? "bg-[#c8a96e]"
                      : "bg-neutral-300"
                  }`}
                />
                <p className="font-semibold text-neutral-900">Text + Image</p>
                <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">
                  Hero section followed by content sections — each with a
                  paragraph of text and a photo displayed side by side.
                </p>
                {form.templateKey === "text-image" && (
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2f2a24]">
                    Selected
                  </p>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-5 py-3.5">
            <p className="text-[12px] text-neutral-500">
              Template:{" "}
              <span className="font-semibold text-neutral-700">
                {form.templateKey === "text-image" ? "Text + Image" : "Text Only"}
              </span>
              <span className="ml-2 text-neutral-400">
                (locked after creation)
              </span>
            </p>
          </div>
        )}

        {/* Core fields */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-neutral-900">
            Page Details
          </h2>
          <div className="grid gap-5">
            <label className="grid gap-2">
              <FieldLabel required>Page Title</FieldLabel>
              <input
                value={form.title}
                onBlur={() =>
                  setTouched((t) => ({ ...t, title: true }))
                }
                onChange={(e) => updateField("title", e.target.value)}
                className={`rounded border px-3 py-2 text-sm outline-none transition ${
                  touched.title && errors.title
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-300 focus:border-amber-400"
                }`}
                placeholder="FIRB Guide for Overseas Buyers"
              />
              <ErrorText
                message={touched.title ? errors.title : undefined}
              />
            </label>

            <label className="grid gap-2">
              <FieldLabel>Slug</FieldLabel>
              <input
                value={form.slug}
                onBlur={() =>
                  !isEditing && setTouched((t) => ({ ...t, slug: true }))
                }
                onChange={(e) =>
                  !isEditing && updateField("slug", e.target.value)
                }
                disabled={isEditing}
                className={`rounded border px-3 py-2 text-sm outline-none transition ${
                  isEditing
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400"
                    : touched.slug && errors.slug
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-300 focus:border-amber-400"
                }`}
                placeholder="firb-guide-overseas-buyers"
              />
              {isEditing ? (
                <p className="text-[11px] text-neutral-400">
                  Slug is locked after creation. Public URL: /more/{form.slug}
                </p>
              ) : (
                <p className="text-[11px] text-neutral-400">
                  Becomes the public URL: /more/
                  {form.slug || "your-page-slug"}
                </p>
              )}
              <ErrorText
                message={!isEditing && touched.slug ? errors.slug : undefined}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel>SEO Title</FieldLabel>
                <input
                  value={form.seoTitle}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="FIRB Guide | PPM"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel>Navigation Label</FieldLabel>
                <input
                  value={form.navLabel}
                  onChange={(e) => updateField("navLabel", e.target.value)}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="FIRB Guide"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <FieldLabel>SEO Description</FieldLabel>
              <textarea
                value={form.seoDescription}
                onChange={(e) =>
                  updateField("seoDescription", e.target.value)
                }
                rows={3}
                className="resize-none rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                placeholder="A practical overview of FIRB requirements for overseas property buyers."
              />
            </label>
          </div>
        </div>

        {/* Hero section */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">
              Hero Section
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Displayed at the top of the page with a dark background.
            </p>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel>Eyebrow Text</FieldLabel>
                <input
                  value={form.heroEyebrow}
                  onChange={(e) =>
                    updateField("heroEyebrow", e.target.value)
                  }
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="Overseas Buyers"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel>Hero Title</FieldLabel>
                <input
                  value={form.heroTitle}
                  onChange={(e) =>
                    updateField("heroTitle", e.target.value)
                  }
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="Understanding FIRB Before You Buy"
                />
              </label>
            </div>
            <label className="grid gap-2">
              <FieldLabel>Hero Summary</FieldLabel>
              <textarea
                value={form.heroSummary}
                onChange={(e) =>
                  updateField("heroSummary", e.target.value)
                }
                rows={3}
                className="resize-none rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                placeholder="A clear introduction shown below the hero title."
              />
            </label>
          </div>
        </div>

        {/* Main content — conditional by template */}
        {form.templateKey === "text-only" ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">
                Page Body
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Use blank lines to separate paragraphs. Each paragraph
                appears as a block of text on the live page.
              </p>
            </div>

            {touched.body && errors.body && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.body}
              </div>
            )}

            <label className="grid gap-2">
              <FieldLabel required>Body Content</FieldLabel>
              <textarea
                value={form.body}
                onBlur={() =>
                  setTouched((t) => ({ ...t, body: true }))
                }
                onChange={(e) => updateField("body", e.target.value)}
                rows={14}
                className={`resize-none rounded border px-3 py-2 text-sm outline-none transition ${
                  touched.body && errors.body
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-300 focus:border-amber-400"
                }`}
                placeholder={`Write your page content here.\n\nUse blank lines to separate paragraphs.\n\nEach paragraph will be displayed as a separate block of text on the live page.`}
              />
            </label>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Page Sections
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Each section displays a heading, paragraph, and optional
                  image side-by-side on the live page.
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

            {touched.sections && errors.sections && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.sections}
              </div>
            )}

            <div className="space-y-5">
              {form.sections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                      Section {index + 1}
                    </p>
                    {form.sections.length > 1 && (
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
                      onChange={(e) =>
                        updateSection(index, "heading", e.target.value)
                      }
                      className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                      placeholder="Optional section heading"
                    />
                  </label>

                  <label className="mt-4 grid gap-2">
                    <FieldLabel required>Body</FieldLabel>
                    <textarea
                      value={section.body}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, sections: true }))
                      }
                      onChange={(e) =>
                        updateSection(index, "body", e.target.value)
                      }
                      rows={6}
                      className={`resize-none rounded border bg-white px-3 py-2 text-sm outline-none transition ${
                        touched.sections && !section.body.trim()
                          ? "border-red-200"
                          : "border-neutral-300 focus:border-amber-400"
                      }`}
                      placeholder="Write the section body text here."
                    />
                  </label>

                  <div className="mt-4 grid gap-2">
                    <FieldLabel>Section Image</FieldLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded border border-neutral-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900">
                        {uploadingSectionIndex === index
                          ? "Uploading…"
                          : section.image
                            ? "Replace Image"
                            : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingSectionIndex === index}
                          onChange={(e) =>
                            handleSectionImageUpload(
                              index,
                              e.target.files?.[0]
                            )
                          }
                        />
                      </label>
                      {section.image && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(index, "image", "")
                          }
                          className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {section.image && (
                      <img
                        src={section.image}
                        alt=""
                        className="mt-2 h-40 w-full rounded object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">
              Call to Action
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Optional closing section to guide the reader toward a next
              step.
            </p>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel>CTA Title</FieldLabel>
                <input
                  value={form.ctaTitle}
                  onChange={(e) =>
                    updateField("ctaTitle", e.target.value)
                  }
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="Speak With Our Team"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel>CTA Link</FieldLabel>
                <input
                  value={form.ctaLink}
                  onChange={(e) =>
                    updateField("ctaLink", e.target.value)
                  }
                  className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  placeholder="/contact/buyers-investors"
                />
              </label>
            </div>
            <label className="grid gap-2">
              <FieldLabel>CTA Text</FieldLabel>
              <textarea
                value={form.ctaText}
                onChange={(e) => updateField("ctaText", e.target.value)}
                rows={3}
                className="resize-none rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                placeholder="Our team can help you identify suitable off-the-plan opportunities."
              />
            </label>
          </div>
        </div>

        {/* Publishing settings */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-neutral-900">
            Publishing Settings
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <FieldLabel>Page Group</FieldLabel>
              <input
                value={form.pageGroup}
                onChange={(e) => updateField("pageGroup", e.target.value)}
                className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                placeholder="guides"
              />
            </label>
            <label className="grid gap-2">
              <FieldLabel>Status Label</FieldLabel>
              <input
                value={form.statusLabel}
                onChange={(e) =>
                  updateField("statusLabel", e.target.value)
                }
                className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                placeholder="Guide"
              />
            </label>
            <label className="grid gap-2">
              <FieldLabel>Sort Order</FieldLabel>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  updateField("sortOrder", Number(e.target.value))
                }
                className="rounded border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-400"
              />
            </label>
            <div className="grid gap-2">
              <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Show in Navbar
              </span>
              <label className="flex min-h-[42px] items-center gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.showInNavbar}
                  onChange={(e) =>
                    updateField("showInNavbar", e.target.checked)
                  }
                  className="h-4 w-4 accent-[#2f2a24]"
                />
                Show this page in the navigation
              </label>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
          <p
            className={`text-[12px] font-medium ${
              hasErrors ? "text-red-600" : "text-green-700"
            }`}
          >
            {hasErrors
              ? "Some required fields need attention."
              : "Page is ready to save."}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={isBusy}
              className="rounded border border-neutral-200 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-400 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={isBusy}
              className="rounded border border-[#5f5245] bg-[#2f2a24] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17] disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
