"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { footerDefaults, FooterContentData } from "@/lib/footer-defaults";

// ── Input components ───────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`rounded border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 focus:border-amber-400 focus:outline-none ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

function TextAreaRow({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="resize-none rounded border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 focus:border-amber-400 focus:outline-none"
      />
    </div>
  );
}

function LinkRow({
  labelTitle,
  labelValue,
  hrefValue,
  onLabelChange,
  onHrefChange,
  index,
}: {
  labelTitle: string;
  labelValue: string;
  hrefValue: string;
  onLabelChange: (v: string) => void;
  onHrefChange: (v: string) => void;
  index: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {labelTitle} — Label
        </label>
        <input
          type="text"
          value={labelValue}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder={`Link ${index} label`}
          className="rounded border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 focus:border-amber-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {labelTitle} — URL
        </label>
        <input
          type="text"
          value={hrefValue}
          onChange={(e) => onHrefChange(e.target.value)}
          placeholder="/page-slug"
          className="rounded border border-neutral-200 px-3 py-2 font-mono text-[13px] text-neutral-800 focus:border-amber-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {title}
        </p>
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </div>
  );
}

// ── Main editor ────────────────────────────────────────────────────────────────

export default function FooterEditor() {
  const [form, setForm] = useState<FooterContentData>({ ...footerDefaults });
  const [lastSaved, setLastSaved] = useState<FooterContentData>({ ...footerDefaults });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content/footer")
      .then((r) => r.json())
      .then((data: FooterContentData) => {
        setForm(data);
        setLastSaved(data);
        setLoading(false);
      });
  }, []);

  function field<K extends keyof FooterContentData>(key: K) {
    return {
      value: form[key],
      onChange: (v: string) => {
        setForm((prev) => ({ ...prev, [key]: v }));
        setSaved(false);
      },
    };
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/content/footer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setLastSaved({ ...form });
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  function confirmRevert() {
    setForm({ ...lastSaved });
    setSaved(false);
    setRevertOpen(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  return (
    <>
      {/* ── Admin toolbar ──────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/pages"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 transition hover:text-black"
          >
            ← Manage Pages
          </Link>
          <span className="text-black/20">|</span>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-black">
              Edit Mode — Footer
            </p>
          </div>
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
            href="/#site-footer"
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
            disabled={saving}
            className="bg-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400 transition hover:bg-black/80 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Editor body ────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-neutral-100 pt-[56px]">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">PPM Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-neutral-900">Footer</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Changes appear on every page of the site. Save when done.
            </p>
          </div>

          {/* Brand ─────────────────────────────────────────────────────── */}
          <SectionCard title="Brand">
            <FieldRow label="Tagline" {...field("brandTagline")} placeholder="PPM · Property Project Marketing" />
            <TextAreaRow label="Address" rows={4} {...field("brandAddress")} />
            <TextAreaRow label="Licence & ABN" rows={2} {...field("brandLicence")} />
            <FieldRow label="Languages" {...field("brandLanguages")} placeholder="Languages: English · 中文 · 한국어" />
          </SectionCard>

          {/* Services links ─────────────────────────────────────────────── */}
          <SectionCard title="Services Links">
            <p className="text-[12px] text-neutral-400">
              These link to pages within the website. Use relative paths (e.g. /buyers/investors).
            </p>
            {([1, 2, 3, 4] as const).map((n) => (
              <LinkRow
                key={n}
                index={n}
                labelTitle={`Link ${n}`}
                labelValue={form[`service${n}Label`]}
                hrefValue={form[`service${n}Href`]}
                onLabelChange={(v) => setForm((p) => ({ ...p, [`service${n}Label`]: v }))}
                onHrefChange={(v) => setForm((p) => ({ ...p, [`service${n}Href`]: v }))}
              />
            ))}
          </SectionCard>

          {/* Company links ──────────────────────────────────────────────── */}
          <SectionCard title="Company Links">
            <p className="text-[12px] text-neutral-400">
              These link to pages within the website. Use relative paths (e.g. /about).
            </p>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <LinkRow
                key={n}
                index={n}
                labelTitle={`Link ${n}`}
                labelValue={form[`company${n}Label`]}
                hrefValue={form[`company${n}Href`]}
                onLabelChange={(v) => setForm((p) => ({ ...p, [`company${n}Label`]: v }))}
                onHrefChange={(v) => setForm((p) => ({ ...p, [`company${n}Href`]: v }))}
              />
            ))}
          </SectionCard>

          {/* Contact ────────────────────────────────────────────────────── */}
          <SectionCard title="Contact">
            <FieldRow label="Sales Email" type="email" {...field("contactSalesEmail")} />
            <FieldRow label="Management Email" type="email" {...field("contactManagementEmail")} />
            <FieldRow label="General Email" type="email" {...field("contactGeneralEmail")} />
            <FieldRow label="Phone 1" {...field("contactPhone1")} placeholder="0418 520 714" />
            <FieldRow label="Phone 2" {...field("contactPhone2")} placeholder="0409 522 394" />
          </SectionCard>

          {/* Social media ───────────────────────────────────────────────── */}
          <SectionCard title="Social Media">
            <p className="text-[12px] text-neutral-400">
              Paste full URLs (e.g. https://www.youtube.com/@yourhandle). Leave blank to hide the icon.
            </p>
            <FieldRow label="YouTube URL" mono {...field("youtubeUrl")} placeholder="https://www.youtube.com/@..." />
            <FieldRow label="Instagram URL" mono {...field("instagramUrl")} placeholder="https://www.instagram.com/..." />
            <FieldRow label="Facebook URL" mono {...field("facebookUrl")} placeholder="https://www.facebook.com/..." />
          </SectionCard>

          {/* Compliance bar ─────────────────────────────────────────────── */}
          <SectionCard title="Compliance Bar">
            <TextAreaRow label="Compliance Text" rows={3} {...field("complianceText")} />
            <FieldRow label="Copyright Text" {...field("copyrightText")} placeholder="© 2026 Property Project Marketing Pty Ltd" />
          </SectionCard>

          <p className="pb-4 text-center text-[11px] text-neutral-400">
            Changes are applied site-wide immediately after saving.
          </p>
        </div>
      </div>

      {/* ── Revert modal ─────────────────────────────────────────────────── */}
      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Discard changes</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will undo all unsaved edits and restore the footer to the last saved state.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRevertOpen(false)}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
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
