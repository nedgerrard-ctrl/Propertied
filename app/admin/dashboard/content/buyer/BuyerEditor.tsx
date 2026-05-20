"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buyerDefaults, BuyerContentData } from "@/lib/buyer-defaults";

type Field = keyof BuyerContentData;

type DynamicProject = {
  _id: string;
  name: string;
  suburb: string;
  state: string;
  type: "Apartment" | "Townhouse" | "House";
  propertyInterest: "off-plan" | "established";
  status: "Current" | "Upcoming";
  bedrooms: string;
  bathrooms: string;
  carSpaces: string;
  priceFrom: string;
  description: string;
  highlights: string[];
  image: string;
  published: boolean;
};

type ToastData = { type: "success" | "error"; message: string } | null;

type ProjectDraft = {
  name?: string; suburb?: string; state?: string;
  type?: "Apartment" | "Townhouse" | "House";
  propertyInterest?: "off-plan" | "established";
  status?: "Current" | "Upcoming";
  bedrooms?: string; bathrooms?: string; carSpaces?: string;
  priceFrom?: string; description?: string; highlights?: string;
  image?: string; imagePreview?: string;
};

const EDIT_LIGHT =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/50 hover:border-amber-500 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-amber-50/60 transition-colors px-0.5";
const EDIT_DARK =
  "outline-none cursor-text border-b-2 border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10 transition-colors px-0.5";

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

const inputBase = "w-full rounded border px-3 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none transition-colors";
const inputNormal = `${inputBase} border-neutral-200 focus:border-amber-400`;
const inputError = `${inputBase} border-red-400 bg-red-50/30 focus:border-red-500`;
const labelClass = "block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-[11px] font-medium text-red-500">{msg}</p>;
}

function ProjectFormFields({
  name, setName, suburb, setSuburb, state, setState, type, setType,
  propertyInterest, setPropertyInterest, status, setStatus,
  bedrooms, setBedrooms, bathrooms, setBathrooms, carSpaces, setCarSpaces,
  priceFrom, setPriceFrom, description, setDescription, highlights, setHighlights,
  image, imagePreview, uploading, onImageChange, errors = {},
}: {
  name: string; setName: (v: string) => void;
  suburb: string; setSuburb: (v: string) => void;
  state: string; setState: (v: string) => void;
  type: "Apartment" | "Townhouse" | "House"; setType: (v: "Apartment" | "Townhouse" | "House") => void;
  propertyInterest: "off-plan" | "established"; setPropertyInterest: (v: "off-plan" | "established") => void;
  status: "Current" | "Upcoming"; setStatus: (v: "Current" | "Upcoming") => void;
  bedrooms: string; setBedrooms: (v: string) => void;
  bathrooms: string; setBathrooms: (v: string) => void;
  carSpaces: string; setCarSpaces: (v: string) => void;
  priceFrom: string; setPriceFrom: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  highlights: string; setHighlights: (v: string) => void;
  image: string; imagePreview: string; uploading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <label className={labelClass}>Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ascot Residences" className={errors.name ? inputError : inputNormal} />
        <FieldError msg={errors.name} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Suburb *</label>
          <input type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. South Yarra" className={errors.suburb ? inputError : inputNormal} />
          <FieldError msg={errors.suburb} />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="VIC" className={inputNormal} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as "Apartment" | "Townhouse" | "House")} className={inputNormal}>
          <option value="Apartment">Apartment</option>
          <option value="Townhouse">Townhouse</option>
          <option value="House">House</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Property Interest</label>
        <select value={propertyInterest} onChange={(e) => setPropertyInterest(e.target.value as "off-plan" | "established")} className={inputNormal}>
          <option value="off-plan">Off the Plan</option>
          <option value="established">Established</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as "Current" | "Upcoming")} className={inputNormal}>
          <option value="Current">Current</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Bedrooms *</label>
          <input type="text" inputMode="numeric" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="e.g. 2 or 1–3" className={errors.bedrooms ? inputError : inputNormal} />
          <FieldError msg={errors.bedrooms} />
        </div>
        <div>
          <label className={labelClass}>Bathrooms *</label>
          <input type="text" inputMode="numeric" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="e.g. 1 or 1–2" className={errors.bathrooms ? inputError : inputNormal} />
          <FieldError msg={errors.bathrooms} />
        </div>
        <div>
          <label className={labelClass}>Car Spaces *</label>
          <input type="text" inputMode="numeric" value={carSpaces} onChange={(e) => setCarSpaces(e.target.value)} placeholder="e.g. 1" className={errors.carSpaces ? inputError : inputNormal} />
          <FieldError msg={errors.carSpaces} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Price From *</label>
        <div className={`flex overflow-hidden rounded border ${errors.priceFrom ? "border-red-400 bg-red-50/30" : "border-neutral-200"} focus-within:border-amber-400`}>
          <span className="flex items-center bg-neutral-100 px-3 text-[13px] font-medium text-neutral-500 select-none border-r border-neutral-200">$</span>
          <input type="text" inputMode="numeric" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="e.g. 480,000" className="flex-1 bg-white px-3 py-2.5 text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none" />
        </div>
        <FieldError msg={errors.priceFrom} />
      </div>
      <div>
        <label className={labelClass}>Description *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Brief description…" className={`${errors.description ? inputError : inputNormal} resize-none`} />
        <FieldError msg={errors.description} />
      </div>
      <div>
        <label className={labelClass}>Key Highlights (one per line)</label>
        <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={4} placeholder={"Walking distance to station\nRooftop terrace"} className={`${inputNormal} resize-none`} />
      </div>
      <div>
        <label className={labelClass}>Image</label>
        {imagePreview && (
          <div className="mb-2 h-32 w-full overflow-hidden rounded border border-neutral-200">
            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-neutral-300 px-4 py-3 text-[12px] text-neutral-500 transition hover:border-amber-400 hover:text-amber-600">
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a.75.75 0 0 1 .75.75V6.5h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8H2.5a.75.75 0 0 1 0-1.5h4.75V1.75A.75.75 0 0 1 8 1Z" />
          </svg>
          {uploading ? "Uploading…" : imagePreview ? "Change Image" : "Upload Image"}
          <input type="file" accept="image/*" className="sr-only" onChange={onImageChange} disabled={uploading} />
        </label>
        <p className="mt-1 text-[11px] text-neutral-400">Optional — leave blank to show a placeholder.</p>
      </div>
    </div>
  );
}

function validateNumeric(v: string): string {
  if (!v.trim()) return "Required";
  if (!/\d/.test(v.trim())) return "Must contain a number (e.g. 2 or 1–3)";
  return "";
}
function validateRequired(v: string): string { return v.trim() ? "" : "Required"; }
function buildProjectErrors(name: string, suburb: string, bedrooms: string, bathrooms: string, carSpaces: string, priceFrom: string, description: string): Record<string, string> {
  return { name: validateRequired(name), suburb: validateRequired(suburb), bedrooms: validateNumeric(bedrooms), bathrooms: validateNumeric(bathrooms), carSpaces: validateNumeric(carSpaces), priceFrom: validateRequired(priceFrom), description: validateRequired(description) };
}
function hasErrors(errors: Record<string, string>): boolean { return Object.values(errors).some((e) => e !== ""); }

function AddProjectModal({ onClose, onAdded, initialValues = {}, onDraftSaved }: { onClose: () => void; onAdded: (p: DynamicProject) => void; initialValues?: ProjectDraft; onDraftSaved: (d: ProjectDraft) => void }) {
  const [name, setName] = useState(initialValues.name ?? "");
  const [suburb, setSuburb] = useState(initialValues.suburb ?? "");
  const [state, setState] = useState(initialValues.state ?? "VIC");
  const [type, setType] = useState<"Apartment" | "Townhouse" | "House">(initialValues.type ?? "Apartment");
  const [propertyInterest, setPropertyInterest] = useState<"off-plan" | "established">(initialValues.propertyInterest ?? "off-plan");
  const [status, setStatus] = useState<"Current" | "Upcoming">(initialValues.status ?? "Current");
  const [bedrooms, setBedrooms] = useState(initialValues.bedrooms ?? "");
  const [bathrooms, setBathrooms] = useState(initialValues.bathrooms ?? "");
  const [carSpaces, setCarSpaces] = useState(initialValues.carSpaces ?? "");
  const [priceFrom, setPriceFrom] = useState(initialValues.priceFrom ?? "");
  const [description, setDescription] = useState(initialValues.description ?? "");
  const [highlights, setHighlights] = useState(initialValues.highlights ?? "");
  const [image, setImage] = useState(initialValues.image ?? "");
  const [imagePreview, setImagePreview] = useState(initialValues.imagePreview ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const draftRef = useRef({ name, suburb, state, type, propertyInterest, status, bedrooms, bathrooms, carSpaces, priceFrom, description, highlights, image, imagePreview });
  useEffect(() => { draftRef.current = { name, suburb, state, type, propertyInterest, status, bedrooms, bathrooms, carSpaces, priceFrom, description, highlights, image, imagePreview }; }, [name, suburb, state, type, propertyInterest, status, bedrooms, bathrooms, carSpaces, priceFrom, description, highlights, image, imagePreview]);
  useEffect(() => { return () => { onDraftSaved(draftRef.current); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleName(v: string) { setName(v); setErrors((p) => ({ ...p, name: validateRequired(v) })); }
  function handleSuburb(v: string) { setSuburb(v); setErrors((p) => ({ ...p, suburb: validateRequired(v) })); }
  function handleBedrooms(v: string) { setBedrooms(v); setErrors((p) => ({ ...p, bedrooms: validateNumeric(v) })); }
  function handleBathrooms(v: string) { setBathrooms(v); setErrors((p) => ({ ...p, bathrooms: validateNumeric(v) })); }
  function handleCarSpaces(v: string) { setCarSpaces(v); setErrors((p) => ({ ...p, carSpaces: validateNumeric(v) })); }
  function handlePriceFrom(v: string) { const digits = v.replace(/\D/g, ""); const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ","); setPriceFrom(formatted); setErrors((p) => ({ ...p, priceFrom: validateRequired(formatted) })); }
  function handleDescription(v: string) { setDescription(v); setErrors((p) => ({ ...p, description: validateRequired(v) })); }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try { const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const data = await res.json(); if (res.ok && data.path) { setImage(data.path); setImagePreview(data.path); } else setApiError(data.error || "Image upload failed."); }
    catch { setApiError("Image upload failed."); }
    finally { setUploading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setApiError("");
    const newErrors = buildProjectErrors(name, suburb, bedrooms, bathrooms, carSpaces, priceFrom, description);
    setErrors(newErrors); if (hasErrors(newErrors)) return;
    setSaving(true);
    const highlightsArr = highlights.split("\n").map((l) => l.trim()).filter(Boolean);
    const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), suburb: suburb.trim(), state: state.trim(), type, propertyInterest, status, bedrooms: bedrooms.trim(), bathrooms: bathrooms.trim(), carSpaces: carSpaces.trim(), priceFrom: priceFrom.trim(), description: description.trim(), highlights: highlightsArr, image }) });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setApiError(data.error || "Failed to add project.");
    else { onDraftSaved({}); onAdded(data as DynamicProject); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <form onSubmit={submit} className="my-auto w-full max-w-xl rounded-xl bg-white p-7 shadow-2xl">
        <h2 className="text-lg font-semibold text-neutral-900">Add Project</h2>
        <p className="mt-1 text-sm text-neutral-500">Appears in the Available Projects grid on the public buyer pages.</p>
        {apiError && <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"><p className="text-[12px] font-medium text-red-700">{apiError}</p></div>}
        <ProjectFormFields name={name} setName={handleName} suburb={suburb} setSuburb={handleSuburb} state={state} setState={setState} type={type} setType={setType} propertyInterest={propertyInterest} setPropertyInterest={setPropertyInterest} status={status} setStatus={setStatus} bedrooms={bedrooms} setBedrooms={handleBedrooms} bathrooms={bathrooms} setBathrooms={handleBathrooms} carSpaces={carSpaces} setCarSpaces={handleCarSpaces} priceFrom={priceFrom} setPriceFrom={handlePriceFrom} description={description} setDescription={handleDescription} highlights={highlights} setHighlights={setHighlights} image={image} imagePreview={imagePreview} uploading={uploading} onImageChange={handleImageChange} errors={errors} />
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400">Cancel</button>
          <button type="submit" disabled={saving || uploading} className="rounded bg-amber-400 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300 disabled:opacity-50">{saving ? "Adding…" : "Add Project"}</button>
        </div>
      </form>
    </div>
  );
}

function EditProjectModal({ project, onClose, onUpdated }: { project: DynamicProject; onClose: () => void; onUpdated: (p: DynamicProject) => void }) {
  const [name, setName] = useState(project.name);
  const [suburb, setSuburb] = useState(project.suburb);
  const [state, setState] = useState(project.state);
  const [type, setType] = useState<"Apartment" | "Townhouse" | "House">(project.type);
  const [propertyInterest, setPropertyInterest] = useState<"off-plan" | "established">(project.propertyInterest);
  const [status, setStatus] = useState<"Current" | "Upcoming">(project.status);
  const [bedrooms, setBedrooms] = useState(project.bedrooms);
  const [bathrooms, setBathrooms] = useState(project.bathrooms);
  const [carSpaces, setCarSpaces] = useState(project.carSpaces);
  const [priceFrom, setPriceFrom] = useState(project.priceFrom);
  const [description, setDescription] = useState(project.description);
  const [highlights, setHighlights] = useState(project.highlights.join("\n"));
  const [image, setImage] = useState(project.image);
  const [imagePreview, setImagePreview] = useState(project.image);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  function handleName(v: string) { setName(v); setErrors((p) => ({ ...p, name: validateRequired(v) })); }
  function handleSuburb(v: string) { setSuburb(v); setErrors((p) => ({ ...p, suburb: validateRequired(v) })); }
  function handleBedrooms(v: string) { setBedrooms(v); setErrors((p) => ({ ...p, bedrooms: validateNumeric(v) })); }
  function handleBathrooms(v: string) { setBathrooms(v); setErrors((p) => ({ ...p, bathrooms: validateNumeric(v) })); }
  function handleCarSpaces(v: string) { setCarSpaces(v); setErrors((p) => ({ ...p, carSpaces: validateNumeric(v) })); }
  function handlePriceFrom(v: string) { const digits = v.replace(/\D/g, ""); const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ","); setPriceFrom(formatted); setErrors((p) => ({ ...p, priceFrom: validateRequired(formatted) })); }
  function handleDescription(v: string) { setDescription(v); setErrors((p) => ({ ...p, description: validateRequired(v) })); }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try { const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const data = await res.json(); if (res.ok && data.path) { setImage(data.path); setImagePreview(data.path); } else setApiError(data.error || "Image upload failed."); }
    catch { setApiError("Image upload failed."); }
    finally { setUploading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setApiError("");
    const newErrors = buildProjectErrors(name, suburb, bedrooms, bathrooms, carSpaces, priceFrom, description);
    setErrors(newErrors); if (hasErrors(newErrors)) return;
    setSaving(true);
    const highlightsArr = highlights.split("\n").map((l) => l.trim()).filter(Boolean);
    const res = await fetch(`/api/admin/projects/${project._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), suburb: suburb.trim(), state: state.trim(), type, propertyInterest, status, bedrooms: bedrooms.trim(), bathrooms: bathrooms.trim(), carSpaces: carSpaces.trim(), priceFrom: priceFrom.trim(), description: description.trim(), highlights: highlightsArr, image }) });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setApiError(data.error || "Failed to save project.");
    else { onUpdated({ ...project, ...data }); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <form onSubmit={submit} className="my-auto w-full max-w-xl rounded-xl bg-white p-7 shadow-2xl">
        <h2 className="text-lg font-semibold text-neutral-900">Edit Project</h2>
        <p className="mt-1 text-sm text-neutral-500">Update details for <strong>{project.name}</strong>.</p>
        {apiError && <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"><p className="text-[12px] font-medium text-red-700">{apiError}</p></div>}
        <ProjectFormFields name={name} setName={handleName} suburb={suburb} setSuburb={handleSuburb} state={state} setState={setState} type={type} setType={setType} propertyInterest={propertyInterest} setPropertyInterest={setPropertyInterest} status={status} setStatus={setStatus} bedrooms={bedrooms} setBedrooms={handleBedrooms} bathrooms={bathrooms} setBathrooms={handleBathrooms} carSpaces={carSpaces} setCarSpaces={handleCarSpaces} priceFrom={priceFrom} setPriceFrom={handlePriceFrom} description={description} setDescription={handleDescription} highlights={highlights} setHighlights={setHighlights} image={image} imagePreview={imagePreview} uploading={uploading} onImageChange={handleImageChange} errors={errors} />
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400">Cancel</button>
          <button type="submit" disabled={saving || uploading} className="rounded bg-amber-400 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-black transition hover:bg-amber-300 disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export default function BuyerEditor({ section }: { section: "investors" | "owner-occupiers" }) {
  const isInvestors = section === "investors";
  const label       = isInvestors ? "Investors" : "Owner-Occupiers";
  const previewHref = isInvestors ? "/buyers/investors" : "/buyers/owner-occupiers";

  const [content, setContent] = useState<BuyerContentData>(buyerDefaults);
  const [projects, setProjects] = useState<DynamicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<ProjectDraft>({});
  const [editingProject, setEditingProject] = useState<DynamicProject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  function showToast(type: "success" | "error", message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/content/buyer?section=${section}`).then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
    ]).then(([cmsData, projectsData]) => {
      setContent((prev) => ({ ...prev, ...cmsData }));
      setProjects(projectsData);
      setLoading(false);
    });
  }, [section]);

  function r(field: Field) { return (el: HTMLElement | null) => { refs.current[field] = el; }; }

  async function confirmRevert() {
    setRevertOpen(false);
    for (const [field, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el && field in buyerDefaults) el.innerText = buyerDefaults[field as keyof typeof buyerDefaults] as string;
    }
    setContent(buyerDefaults);
    await fetch("/api/admin/content/buyer", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section, ...buyerDefaults }) });
    showToast("success", "Content reverted to defaults.");
  }

  async function save() {
    const updates: Partial<Record<Field, string>> = {};
    for (const [key, el] of Object.entries(refs.current) as [Field, HTMLElement | null][]) {
      if (el) updates[key] = el.innerText.trim();
    }
    setSaving(true);
    const res = await fetch("/api/admin/content/buyer", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section, ...updates }) });
    setSaving(false);
    if (res.ok) { setContent((prev) => ({ ...prev, ...updates } as BuyerContentData)); showToast("success", "Changes saved successfully."); }
    else { const data = await res.json().catch(() => ({})); showToast("error", data.error || "Failed to save changes."); }
  }

  async function deleteProject(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) { setProjects((prev) => prev.filter((p) => p._id !== id)); showToast("success", "Project deleted."); }
    else showToast("error", "Failed to delete project.");
  }

  async function togglePublish(project: DynamicProject) {
    setTogglingId(project._id);
    const res = await fetch(`/api/admin/projects/${project._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !project.published }) });
    setTogglingId(null);
    if (res.ok) { setProjects((prev) => prev.map((p) => (p._id === project._id ? { ...p, published: !project.published } : p))); showToast("success", project.published ? "Project hidden from public." : "Project is now live."); }
    else showToast("error", "Failed to update project.");
  }

  const c = content;
  const bulletFields: Field[] = isInvestors
    ? ["investorsBullet1", "investorsBullet2", "investorsBullet3", "investorsBullet4", "investorsBullet5"]
    : ["ownerBullet1", "ownerBullet2", "ownerBullet3"];

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">Loading…</div>;

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Toolbar */}
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/pages" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 hover:text-black transition">
            ← Pages
          </Link>
          <span className="text-black/20">|</span>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-black">Edit Mode — {label}</p>
          </div>
          <span className="hidden sm:inline text-[11px] text-black/50">· Click any underlined text to edit</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={previewHref} target="_blank" rel="noopener noreferrer" className="border border-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70 transition hover:border-black/60 hover:text-black">
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

      <main className="min-h-screen w-full pt-[48px] [&_a]:pointer-events-none [&_a]:cursor-default">

        {/* S1: Hero */}
        <section className="relative bg-[#0f0c0a] py-32 overflow-hidden">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-[#6b5e54]">For {label}</p>
            <h1 className="text-5xl font-light leading-[1.1] text-white md:text-7xl">
              <span ref={r("heroLine1")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.heroLine1}</span>
              <br />
              <em className="italic text-[#c8a96e]">
                <span ref={r("heroAccent")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.heroAccent}</span>
              </em>{" "}
              <span ref={r("heroLine3")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.heroLine3}</span>
            </h1>
            <p ref={r("heroSubtext")} contentEditable suppressContentEditableWarning className={`mt-8 max-w-md text-[14px] font-light leading-[2] text-[#8a7b6d] ${EDIT_DARK}`}>{c.heroSubtext}</p>
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-12">
              <div>
                <p className="mb-2 text-4xl font-light text-[#c8a96e]">{projects.filter((p) => p.published).length}</p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#6b5e54]">Active Projects</p>
              </div>
              <div>
                <p className="mb-2 text-4xl font-light text-[#c8a96e]"><span ref={r("stat2Value")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.stat2Value}</span></p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#6b5e54]"><span ref={r("stat2Label")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.stat2Label}</span></p>
              </div>
              <div>
                <p className="mb-2 text-4xl font-light text-[#c8a96e]"><span ref={r("stat3Value")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.stat3Value}</span></p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#6b5e54]"><span ref={r("stat3Label")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.stat3Label}</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* S3: Section-specific content */}
        <section className="relative border-y border-[#e3d8ca] bg-[#f6f2eb] py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="max-w-2xl">
              <div className="mb-8 flex items-start justify-between border-t border-[#c8a96e]/40 pt-8">
                <h3 className="text-3xl font-light text-[#1f1a17]">
                  <span
                    ref={r(isInvestors ? "investorsHeading" : "ownerHeading")}
                    contentEditable suppressContentEditableWarning
                    className={EDIT_LIGHT}
                  >
                    {isInvestors ? c.investorsHeading : c.ownerHeading}
                  </span>
                </h3>
                <span className="tabular-nums text-sm text-[#8a7b6d]">{isInvestors ? "01" : "02"}</span>
              </div>
              <div className="mb-8 space-y-4 text-[13px] font-light leading-[2] text-[#5a4a3f]">
                <p
                  ref={r(isInvestors ? "investorsBody" : "ownerBody")}
                  contentEditable suppressContentEditableWarning
                  className={EDIT_LIGHT}
                >
                  {isInvestors ? c.investorsBody : c.ownerBody}
                </p>
                {isInvestors && (
                  <p
                    ref={r("investorsBody2")}
                    contentEditable suppressContentEditableWarning
                    className={EDIT_LIGHT}
                  >
                    {c.investorsBody2}
                  </p>
                )}
              </div>
              <p
                ref={r(isInvestors ? "investorsStepsLabel" : "ownerStepsLabel")}
                contentEditable suppressContentEditableWarning
                className={`mb-4 text-[10px] uppercase tracking-[0.22em] text-[#c8a96e] ${EDIT_LIGHT}`}
              >
                {isInvestors ? c.investorsStepsLabel : c.ownerStepsLabel}
              </p>
              <ol className="mb-12 space-y-4 text-[13px] text-[#2a1f1a]">
                {bulletFields.map((field, i) => (
                  <li key={field} className="flex gap-3">
                    <span className="shrink-0 font-semibold text-[#c8a96e]">{i + 1}.</span>
                    <span ref={r(field)} contentEditable suppressContentEditableWarning className={EDIT_LIGHT}>{c[field]}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* S4: Projects */}
        <section className="bg-[#1e1a15] py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.32em] text-neutral-500">Featured &amp; Current</p>
                <p className="text-2xl font-light text-white">Available Projects</p>
                <p className="mt-1 text-[13px] text-neutral-500">
                  {projects.filter((p) => p.published).length} published · {projects.length} total · shared across both buyer pages
                </p>
              </div>
              <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 bg-[#c8a96e] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0a0806] transition hover:bg-[#b8995e]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" /></svg>
                Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded border-2 border-dashed border-neutral-700 py-24">
                <p className="text-[13px] text-neutral-500">No projects yet.</p>
                <button onClick={() => setAddOpen(true)} className="mt-4 text-[12px] font-semibold text-[#c8a96e] underline underline-offset-2 transition hover:text-[#b8995e]">Add your first project →</button>
              </div>
            ) : (
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {projects.map((project) => (
                  <div key={project._id} className={`group relative overflow-hidden border bg-[#0f0c0a] ${project.published ? "border-neutral-700" : "border-neutral-700/40 opacity-60"}`}>
                    {!project.published && (
                      <div className="absolute inset-x-0 top-0 z-10 bg-red-900/80 py-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">Hidden from public</div>
                    )}
                    <div className={`relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 ${!project.published ? "mt-6" : ""}`}>
                      {project.image ? (
                        <img src={project.image} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><span className="text-[11px] uppercase tracking-[0.2em] text-neutral-600">No image</span></div>
                      )}
                      <div className="absolute left-3 top-3">
                        <span className={["px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em]", project.propertyInterest === "off-plan" ? "bg-[#0a0806]/70 text-white border border-white/15 backdrop-blur-sm" : "bg-white/10 text-[#c8a96e] border border-[#c8a96e]/35 backdrop-blur-sm"].join(" ")}>
                          {project.propertyInterest === "off-plan" ? "Off the Plan" : "Established"}
                        </span>
                      </div>
                      <div className="absolute right-3 top-3">
                        <span className={["px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em]", project.status === "Current" ? "bg-[#c8a96e] text-[#0a0806]" : "bg-black/60 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm"].join(" ")}>{project.status}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.22em] text-neutral-500">{project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}</p>
                      <h3 className="mb-2 text-xl font-light text-white">{project.name}</h3>
                      <p className="text-[12px] text-[#c8a96e]">From ${project.priceFrom}</p>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button onClick={() => setEditingProject(project)} className="flex items-center gap-1.5 rounded bg-neutral-700/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-200 transition hover:bg-neutral-600" title="Edit project">
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" /></svg>
                        Edit
                      </button>
                      <button onClick={() => togglePublish(project)} disabled={togglingId === project._id} className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition disabled:opacity-50 ${project.published ? "bg-yellow-900/80 text-yellow-300 hover:bg-yellow-800" : "bg-green-900/80 text-green-300 hover:bg-green-800"}`} title={project.published ? "Hide from public" : "Show on public site"}>
                        {togglingId === project._id ? "…" : project.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => deleteProject(project._id)} disabled={deletingId === project._id} className="flex items-center gap-1.5 rounded bg-red-900/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-300 transition hover:bg-red-700 disabled:opacity-50" title="Delete this project">
                        {deletingId === project._id ? "…" : (<><svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor"><path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.559a.75.75 0 1 0-1.492.12l.66 8.25A1.75 1.75 0 0 0 5.405 16.5h5.19a1.75 1.75 0 0 0 1.741-1.57l.66-8.25a.75.75 0 1 0-1.492-.12l-.66 8.25a.25.25 0 0 1-.249.224H5.405a.25.25 0 0 1-.249-.224l-.66-8.25Z" /></svg>Delete</>)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* S5: CTA */}
        <section className="relative border-t border-white/[0.06] bg-[#2f2a24] py-32">
          <EditBadge />
          <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
            <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-neutral-500">Ready to Begin?</p>
            <h2 className="mb-6 text-4xl font-light text-white md:text-5xl">
              <span ref={r("ctaHeading")} contentEditable suppressContentEditableWarning className={EDIT_DARK}>{c.ctaHeading}</span>
            </h2>
            <p ref={r("ctaBody")} contentEditable suppressContentEditableWarning className={`mx-auto max-w-lg text-[14px] font-light leading-[2] text-neutral-400 ${EDIT_DARK}`}>{c.ctaBody}</p>
          </div>
        </section>

      </main>

      {addOpen && (
        <AddProjectModal onClose={() => setAddOpen(false)} initialValues={addDraft} onDraftSaved={setAddDraft} onAdded={(p) => { setProjects((prev) => [p, ...prev]); showToast("success", `"${p.name}" added successfully.`); }} />
      )}
      {editingProject && (
        <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onUpdated={(updated) => { setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p))); setEditingProject(null); showToast("success", `"${updated.name}" updated successfully.`); }} />
      )}

      {revertOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Revert to default</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">This will reset all text content back to the original defaults and overwrite any saved changes. Projects are not affected. This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setRevertOpen(false)} className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900">Cancel</button>
              <button type="button" onClick={confirmRevert} className="rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
