"use client";

import { useMemo, useState } from "react";

type PageFormData = {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  body: string;
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

const defaultValues: PageFormData = {
  title: "",
  slug: "",
  seoTitle: "",
  seoDescription: "",
  heroEyebrow: "",
  heroTitle: "",
  heroSummary: "",
  body: "",
  ctaTitle: "",
  ctaText: "",
  ctaLink: "",
  navLabel: "",
  pageGroup: "more",
  statusLabel: "",
  showInNavbar: false,
  sortOrder: 100,
  featuredImage: ""
};

function getUnderlineInputClass() {
  return "w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]";
}

function getTextareaClass(rows = 5) {
  return `w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] leading-7 text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] resize-none focus:border-[#5f5245] rows-${rows}`;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8b7e70]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[28px] font-light tracking-[-0.02em] text-[#1f1a17]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[14px] leading-7 text-[#6f655d]">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5b5147]">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[12px] leading-6 text-[#8b7e70]">{hint}</p> : null}
    </div>
  );
}

function formatPreviewParagraphs(body: string) {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function PageForm({
  initialValues = defaultValues,
  pageId,
}: {
  initialValues?: PageFormData;
  pageId?: string;
}) {
  const [form, setForm] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function update<K extends keyof PageFormData>(key: K, value: PageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveDraft() {
    setSaving(true);

    const method = pageId ? "PATCH" : "POST";
    const url = pageId ? `/api/admin/pages/${pageId}` : "/api/admin/pages";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        status: "draft",
        templateKey: "simple-info-page",
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to save draft");
      return;
    }

    alert("Draft saved");
  }

  async function publish() {
    if (!pageId) {
      alert("Save the page first before publishing.");
      return;
    }

    setPublishing(true);

    const res = await fetch(`/api/admin/pages/${pageId}/publish`, {
      method: "POST",
    });

    setPublishing(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to publish");
      return;
    }

    alert("Page published");
  }

  const previewParagraphs = useMemo(
    () => formatPreviewParagraphs(form.body),
    [form.body]
  );

  return (
    <div className="space-y-12">
      <section className="rounded-[24px] border border-[#ddd3c7] bg-[#faf7f2] p-8 md:p-10">
        <SectionHeading
          eyebrow="Template"
          title="Simple Informational Page"
          description="This template is for text-led guide pages such as FIRB guides, buying process explanations, and educational landing pages."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Page Title" hint="Short text">
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="FIRB Guide for Overseas Buyers"
            />
          </Field>

          <Field label="Slug" hint="Short text · lowercase and hyphen-separated">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="firb-guide-overseas-buyers"
            />
          </Field>

          <Field label="SEO Title" hint="Short text">
            <input
              value={form.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="FIRB Guide | PPM"
            />
          </Field>

          <Field label="Navigation Label" hint="Short text">
            <input
              value={form.navLabel}
              onChange={(e) => update("navLabel", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="FIRB Guide"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="SEO Description" hint="Long text">
              <textarea
                value={form.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
                className={getTextareaClass()}
                placeholder="A practical overview of FIRB requirements for overseas property buyers."
                rows={4}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#ddd3c7] bg-white p-8 md:p-10">
        <SectionHeading
          eyebrow="Hero Section"
          title="Opening Content"
          description="These fields control the hero section at the top of the page."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Hero Eyebrow" hint="Short text">
            <input
              value={form.heroEyebrow}
              onChange={(e) => update("heroEyebrow", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="Overseas Buyers"
            />
          </Field>

          <Field label="Hero Title" hint="Short text">
            <input
              value={form.heroTitle}
              onChange={(e) => update("heroTitle", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="Understanding FIRB Before You Buy"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Hero Summary" hint="Long text">
              <textarea
                value={form.heroSummary}
                onChange={(e) => update("heroSummary", e.target.value)}
                className={getTextareaClass()}
                placeholder="A clear introduction to what overseas buyers should know before purchasing residential property in Australia."
                rows={5}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#ddd3c7] bg-[#faf7f2] p-8 md:p-10">
        <SectionHeading
          eyebrow="Main Content"
          title="Guide Body"
          description="Use blank lines to separate paragraphs. This template is text-only, so keep the writing structured and readable."
        />

        <Field label="Body" hint="Long text">
          <textarea
            value={form.body}
            onChange={(e) => update("body", e.target.value)}
            className={getTextareaClass()}
            placeholder={`Foreign Investment Review Board approval is often required before an overseas buyer purchases residential property in Australia.

Approval requirements depend on the buyer's status and the type of property being acquired.

PPM helps clients understand the process, prepare documentation, and align purchase timing with approval steps.`}
            rows={14}
          />
        </Field>
      </section>

      <section className="rounded-[24px] border border-[#ddd3c7] bg-white p-8 md:p-10">
        <SectionHeading
          eyebrow="Call To Action"
          title="Closing Section"
          description="Use this section to guide the reader toward a next step."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="CTA Title" hint="Short text">
            <input
              value={form.ctaTitle}
              onChange={(e) => update("ctaTitle", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="Speak With Our Team"
            />
          </Field>

          <Field label="CTA Link" hint="Short text · internal path or full URL">
            <input
              value={form.ctaLink}
              onChange={(e) => update("ctaLink", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="/contact/buyers-investors"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="CTA Text" hint="Long text">
              <textarea
                value={form.ctaText}
                onChange={(e) => update("ctaText", e.target.value)}
                className={getTextareaClass()}
                placeholder="Our team can help you understand the process and identify suitable off-the-plan opportunities."
                rows={4}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#ddd3c7] bg-[#faf7f2] p-8 md:p-10">
        <SectionHeading
          eyebrow="Publishing"
          title="Visibility Settings"
          description="These settings control how the page is organised inside the site."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Page Group" hint="Short text">
            <input
              value={form.pageGroup}
              onChange={(e) => update("pageGroup", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="guides"
            />
          </Field>

          <Field label="Status Label" hint="Short text">
            <input
              value={form.statusLabel}
              onChange={(e) => update("statusLabel", e.target.value)}
              className={getUnderlineInputClass()}
              placeholder="Guide"
            />
          </Field>

          <Field label="Sort Order" hint="Number">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => update("sortOrder", Number(e.target.value))}
              className={getUnderlineInputClass()}
              placeholder="100"
            />
          </Field>

          <Field label="Show In Navbar" hint="Boolean">
            <label className="flex min-h-[48px] items-center gap-3 border-b border-[#cfc2b2] py-3 text-[14px] text-[#1f1a17]">
              <input
                type="checkbox"
                checked={form.showInNavbar}
                onChange={(e) => update("showInNavbar", e.target.checked)}
                className="h-4 w-4 accent-[#2f2a24]"
              />
              Show this page in the navigation
            </label>
          </Field>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#ddd3c7] bg-[#0f0d0b] p-8 md:p-10 text-white">
        <SectionHeading
          eyebrow="Preview"
          title={form.heroTitle || form.title || "Your Guide Preview"}
          description="This is a simple preview of how the text-led page structure will feel."
        />

        {form.heroEyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8b7e70]">
            {form.heroEyebrow}
          </p>
        ) : null}

        {form.heroSummary ? (
          <p className="mt-5 max-w-2xl text-[14px] leading-8 text-[#c7bbb0]">
            {form.heroSummary}
          </p>
        ) : null}

        {previewParagraphs.length > 0 ? (
          <div className="mt-10 space-y-6">
            {previewParagraphs.slice(0, 3).map((paragraph, index) => (
              <p key={index} className="max-w-3xl text-[15px] leading-8 text-[#e7dfd7]">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-10 max-w-2xl text-[14px] leading-8 text-[#c7bbb0]">
            Add body content to see the page structure take shape.
          </p>
        )}

        {(form.ctaTitle || form.ctaText) && (
          <div className="mt-12 border-t border-[#2c241c] pt-8">
            {form.ctaTitle ? (
              <h3 className="text-[24px] font-light text-white">{form.ctaTitle}</h3>
            ) : null}
            {form.ctaText ? (
              <p className="mt-4 max-w-2xl text-[14px] leading-8 text-[#c7bbb0]">
                {form.ctaText}
              </p>
            ) : null}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveDraft}
          disabled={saving}
          className="border border-[#5f5245] bg-[#2f2a24] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={publish}
          disabled={publishing || !pageId}
          className="border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17] disabled:opacity-60"
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}