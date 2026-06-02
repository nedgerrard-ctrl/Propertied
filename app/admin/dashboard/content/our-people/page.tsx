"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ourPeopleDefaults, OurPeopleContentData, Person } from "@/lib/our-people-defaults";

type HeroField = "heroHeadingMain" | "heroHeadingAccent" | "heroSubtext";

const EDIT_LIGHT = "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK  = "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

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

function generateId() {
  return `person-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function OurPeopleInlineEditor() {
  const [content, setContent] = useState<OurPeopleContentData>(ourPeopleDefaults);
  const [people, setPeople] = useState<Person[]>(ourPeopleDefaults.people);
  const [lastSaved, setLastSaved] = useState<OurPeopleContentData>(ourPeopleDefaults);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const refs = useRef<Partial<Record<HeroField, HTMLElement | null>>>({});

  useEffect(() => {
    fetch("/api/admin/content/our-people")
      .then((r) => r.json())
      .then((data: OurPeopleContentData) => {
        setContent(data);
        setPeople(data.people ?? ourPeopleDefaults.people);
        setLastSaved(data);
        setLoading(false);
      });
  }, []);

  function r(field: HeroField) {
    return (el: HTMLElement | null) => { refs.current[field] = el; };
  }

  function updatePerson(id: string, field: keyof Omit<Person, "id">, value: string) {
    setSaved(false);
    setPeople((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  function addPerson() {
    setSaved(false);
    setPeople((prev) => [
      ...prev,
      { id: generateId(), name: "", title: "", description: "" },
    ]);
  }

  function confirmDelete(id: string) {
    setDeleteTarget(id);
  }

  function doDelete() {
    if (!deleteTarget) return;
    setSaved(false);
    setPeople((prev) => prev.filter((p) => p.id !== deleteTarget));
    setDeleteTarget(null);
  }

  function confirmRevert() {
    setRevertOpen(false);
    const heroFields: HeroField[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    for (const field of heroFields) {
      const el = refs.current[field];
      if (el) el.innerText = lastSaved[field];
    }
    setContent(lastSaved);
    setPeople(lastSaved.people);
    setSaved(false);
  }

  async function save() {
    const heroUpdates: Partial<Record<HeroField, string>> = {};
    const heroFields: HeroField[] = ["heroHeadingMain", "heroHeadingAccent", "heroSubtext"];
    for (const key of heroFields) {
      const el = refs.current[key];
      if (el) heroUpdates[key] = el.innerText.trim();
    }

    setSaving(true);
    const res = await fetch("/api/admin/content/our-people", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...heroUpdates, people }),
    });
    setSaving(false);
    if (res.ok) {
      const snapshot: OurPeopleContentData = { ...content, ...heroUpdates, people };
      setLastSaved(snapshot);
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to save changes.");
    }
  }

  const c = content;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

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
              Edit Mode — Our People
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-black/50">
            · Click any underlined text to edit · Use the People section below to add or remove team members
          </span>
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
          <a
            href="/our-people"
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

      {/* ── Page preview (editable) ─────────────────────────────────────────── */}
      <main className="min-h-screen w-full text-[#1f1a17] pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
          <EditBadge />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Our People</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">The Team</p>
            </div>
            <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
                <span ref={r("heroHeadingMain")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>
                  {c.heroHeadingMain}
                </span>
                <br />
                <span ref={r("heroHeadingAccent")} contentEditable suppressContentEditableWarning className={`text-[#c8a96e] ${EDIT_DARK}`}>
                  {c.heroHeadingAccent}
                </span>
              </h1>
            </div>
            <p ref={r("heroSubtext")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-[48ch] text-[14px] leading-[1.9] text-[#8a7b6d] ${EDIT_DARK}`}>
              {c.heroSubtext}
            </p>
            <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
              <span className="block h-px w-10 bg-[#3a302a]" />
              <span>Meet The Team</span>
            </div>
          </div>
        </section>

        {/* S2: People */}
        <section className="relative bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-8">

            {/* Section header with Add button */}
            <div className="mb-10 flex items-center justify-between border-b border-[#ede8e1] pb-6">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a8f83]">
                  Team Members
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  {people.length}
                </span>
              </div>
              <button
                type="button"
                onClick={addPerson}
                className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300 active:scale-95"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z"/>
                </svg>
                Add Person
              </button>
            </div>

            {people.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-[14px] text-[#9a8f83]">No team members yet.</p>
                <button
                  type="button"
                  onClick={addPerson}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300"
                >
                  Add First Person
                </button>
              </div>
            )}

            <div className="divide-y divide-[#ede8e1]">
              {people.map((person) => (
                <div key={person.id} className="py-12 first:pt-0">

                  {/* Name + Title row */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-2">
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                        placeholder="Full name"
                        className={`min-w-[8rem] bg-transparent text-[1.4rem] font-semibold text-[#1f1a17] ${EDIT_LIGHT} placeholder:font-normal placeholder:text-[#c8bfb4] placeholder:text-[1rem]`}
                      />
                      <span className="text-[#ddd3c6] font-light text-[1.2rem]">—</span>
                      <input
                        type="text"
                        value={person.title}
                        onChange={(e) => updatePerson(person.id, "title", e.target.value)}
                        placeholder="Title or role"
                        className={`min-w-[8rem] flex-1 bg-transparent text-[1rem] text-[#4a3d35] ${EDIT_LIGHT} placeholder:text-[#c8bfb4]`}
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => confirmDelete(person.id)}
                      title="Remove this person"
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100 hover:border-red-300 active:scale-95"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                      Remove
                    </button>
                  </div>

                  <div className="mb-5 w-10 h-px bg-[#c8a96e]" />

                  {/* Description textarea */}
                  <textarea
                    value={person.description}
                    onChange={(e) => updatePerson(person.id, "description", e.target.value)}
                    placeholder={"Enter description…\n\nPress Enter twice between sentences to create separate paragraphs on the public page."}
                    rows={6}
                    className={`w-full resize-y bg-transparent text-[14px] leading-[1.85] text-[#3d3530] ${EDIT_LIGHT} placeholder:text-[#c8bfb4] placeholder:text-[13px]`}
                  />
                </div>
              ))}
            </div>

            {/* Bottom Add button when list is non-empty */}
            {people.length > 0 && (
              <div className="mt-10 flex justify-center border-t border-[#ede8e1] pt-8">
                <button
                  type="button"
                  onClick={addPerson}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-amber-400 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-600 transition hover:bg-amber-50 active:scale-95"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z"/>
                  </svg>
                  Add Another Person
                </button>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* ── Revert confirmation modal ───────────────────────────────────────── */}
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

      {/* ── Delete confirmation modal ───────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Remove team member</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Are you sure you want to remove{" "}
              <strong>{people.find((p) => p.id === deleteTarget)?.name || "this person"}</strong>?
              They will be permanently removed when you save.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doDelete}
                className="rounded border border-red-600 bg-red-600 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
