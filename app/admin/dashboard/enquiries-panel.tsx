"use client";

import { useEffect, useMemo, useState } from "react";

type EnquiryStatus = "pending" | "qualified" | "in-progress" | "closed";
type EnquiryType = "general" | "developer" | "buyer";
type PropertyInterest = "off-plan" | "established" | "";

type LegalDocument = {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
};

type Enquiry = {
  _id: string;
  enquiryType: EnquiryType;

  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  message: string;

  buyerType: "owner-occupier" | "investor" | "";
  investorRegion: "local" | "overseas" | "";
  minBudget: string;
  maxBudget: string;
  preferredLocations: string;
  propertyInterest: PropertyInterest;
  minBedrooms: string;
  maxBedrooms: string;
  minBathrooms: string;
  maxBathrooms: string;
  minCarSpaces: string;
  maxCarSpaces: string;
  propertyType: string;
  keywords: string;
  legalDocuments: LegalDocument[];

  projectName: string;
  projectLocation: string;
  commissionStructureInterest: string;

  status: EnquiryStatus;
  createdAt: string;
  agentboxEnquiryId?: string | null;
  listingId?: string;
};

const STATUS_OPTIONS: EnquiryStatus[] = [
  "pending",
  "qualified",
  "in-progress",
  "closed",
];

const STATUS_LABEL: Record<EnquiryStatus, string> = {
  pending: "Pending",
  qualified: "Qualified",
  "in-progress": "In Progress",
  closed: "Closed",
};

const STATUS_BADGE: Record<EnquiryStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  qualified: "bg-emerald-100 text-emerald-800",
  "in-progress": "bg-blue-100 text-blue-800",
  closed: "bg-neutral-200 text-neutral-600",
};

const STATUS_BUTTON: Record<EnquiryStatus, string> = {
  pending: "border-amber-400 bg-amber-50 text-amber-800",
  qualified: "border-emerald-400 bg-emerald-50 text-emerald-800",
  "in-progress": "border-blue-400 bg-blue-50 text-blue-800",
  closed: "border-neutral-400 bg-neutral-100 text-neutral-600",
};

function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        STATUS_BADGE[status] ?? "bg-neutral-100 text-neutral-500"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPhone(countryCode?: string, phone?: string) {
  const safePhone = phone?.trim() ?? "";
  const safeCode = countryCode?.trim() ?? "";
  return [safeCode, safePhone].filter(Boolean).join(" ");
}

function formatFileSize(fileSize: number) {
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

function getEnquiryTypeLabel(type: EnquiryType) {
  switch (type) {
    case "buyer":
      return "Buyer / Investor";
    case "developer":
      return "Developer";
    case "general":
    default:
      return "General";
  }
}

function getTypeLabel(enquiry: Enquiry) {
  if (enquiry.enquiryType === "buyer") {
    if (enquiry.propertyInterest === "off-plan") return "Off-the-Plan";
    if (enquiry.propertyInterest === "established") return "Established";
    return "Buyer / Investor";
  }

  if (enquiry.enquiryType === "developer") return "Developer Enquiry";
  return "General Enquiry";
}

function getSummaryLabel(enquiry: Enquiry) {
  if (enquiry.enquiryType === "buyer") {
    const parts = [enquiry.buyerType, enquiry.investorRegion].filter(Boolean);
    return parts.length > 0 ? parts.join(" • ") : "Buyer / Investor";
  }

  if (enquiry.enquiryType === "developer") {
    return enquiry.projectName || "Developer";
  }

  return "General Contact";
}

async function patchStatus(id: string, status: EnquiryStatus) {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.ok;
}

async function deleteEnquiry(id: string) {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete enquiry");
  }

  return true;
}

async function bulkDeleteEnquiries(ids: string[]) {
  const res = await fetch("/api/admin/enquiries", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete selected enquiries");
  }

  return true;
}

function InlineStatusSelect({
  enquiry,
  onStatusUpdate,
}: {
  enquiry: Enquiry;
  onStatusUpdate: (id: string, status: EnquiryStatus) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    const next = e.target.value as EnquiryStatus;
    setSaving(true);
    const ok = await patchStatus(enquiry._id, next);
    if (ok) onStatusUpdate(enquiry._id, next);
    setSaving(false);
  }

  return (
    <select
      value={enquiry.status}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      disabled={saving}
      className={`cursor-pointer rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition disabled:opacity-50 ${
        STATUS_BADGE[enquiry.status] ?? "bg-neutral-100 text-neutral-500"
      }`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option
          key={s}
          value={s}
          className="bg-white normal-case text-neutral-900"
        >
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmVariant = "danger",
  loading = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: "danger" | "blue";
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-md rounded-sm bg-white p-8 text-center shadow-2xl">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            confirmVariant === "danger" ? "bg-red-100" : "bg-blue-100"
          }`}
        >
          {confirmVariant === "danger" ? (
            <svg viewBox="0 0 20 20" className="h-7 w-7 fill-red-600">
              <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-10.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-7 w-7 fill-blue-600">
              <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-10.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
          )}
        </div>

        <h3 className="mt-5 text-2xl font-light text-[#1f1a17]">{title}</h3>
        <p className="mt-3 text-[14px] leading-7 text-[#6c6258]">{message}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-sm border border-neutral-200 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full rounded-sm px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition disabled:opacity-50 ${
              confirmVariant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({
  enquiry,
  onClose,
  onStatusUpdate,
  onDelete,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatusUpdate: (id: string, status: EnquiryStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [pendingStatus, setPendingStatus] = useState<EnquiryStatus>(
    enquiry.status
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setPendingStatus(enquiry.status);
  }, [enquiry.status]);

  async function handleSave() {
    if (pendingStatus === enquiry.status) return;

    setSaving(true);
    const ok = await patchStatus(enquiry._id, pendingStatus);

    if (ok) {
      onStatusUpdate(enquiry._id, pendingStatus);
      setSaved(true);
      setTimeout(() => onClose(), 1500);
    }

    setSaving(false);
  }

  async function handleConfirmDelete() {
    setDeleting(true);

    try {
      await deleteEnquiry(enquiry._id);
      onDelete(enquiry._id);
      setShowDeleteConfirm(false);
      onClose();
    } catch {
      alert("Failed to delete enquiry.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />

      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Enquiry Detail
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-neutral-900">
              {enquiry.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-6 py-6">
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Contact
            </p>

            <dl className="space-y-2 text-[13px]">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Email</dt>
                <dd className="break-all font-medium text-neutral-900">
                  <a href={`mailto:${enquiry.email}`} className="hover:underline">
                    {enquiry.email}
                  </a>
                </dd>
              </div>

              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Phone</dt>
                <dd className="font-medium text-neutral-900">
                  <a
                    href={`tel:${formatPhone(
                      enquiry.phoneCountryCode,
                      enquiry.phone
                    ).replace(/\s+/g, "")}`}
                    className="hover:underline"
                  >
                    {formatPhone(enquiry.phoneCountryCode, enquiry.phone)}
                  </a>
                </dd>
              </div>

              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Submitted</dt>
                <dd className="font-medium text-neutral-900">
                  {formatDate(enquiry.createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          <hr className="border-neutral-100" />

          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Enquiry Overview
            </p>

            <dl className="space-y-2 text-[13px]">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Enquiry</dt>
                <dd className="font-medium text-neutral-900">
                  {getEnquiryTypeLabel(enquiry.enquiryType)}
                </dd>
              </div>

              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Type</dt>
                <dd className="font-medium text-neutral-900">
                  {getTypeLabel(enquiry)}
                </dd>
              </div>

              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Status</dt>
                <dd>
                  <StatusBadge status={enquiry.status} />
                </dd>
              </div>
            </dl>
          </section>

          {enquiry.enquiryType === "buyer" && (
            <>
              <hr className="border-neutral-100" />

              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Buyer / Investor Details
                </p>

                <dl className="space-y-2 text-[13px]">
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Buyer Type</dt>
                    <dd className="font-medium capitalize text-neutral-900">
                      {enquiry.buyerType || "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Region</dt>
                    <dd className="font-medium capitalize text-neutral-900">
                      {enquiry.investorRegion || "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Interest</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.propertyInterest === "off-plan"
                        ? "Off-the-Plan"
                        : enquiry.propertyInterest === "established"
                          ? "Established"
                          : "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Budget</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.minBudget || enquiry.maxBudget
                        ? `${enquiry.minBudget || "Any"} – ${enquiry.maxBudget || "Any"}`
                        : "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Locations</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.preferredLocations || "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Bedrooms</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.minBedrooms || enquiry.maxBedrooms
                        ? `${enquiry.minBedrooms || "Any"} – ${enquiry.maxBedrooms || "Any"}`
                        : "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Bathrooms</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.minBathrooms || enquiry.maxBathrooms
                        ? `${enquiry.minBathrooms || "Any"} – ${enquiry.maxBathrooms || "Any"}`
                        : "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Car Spaces</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.minCarSpaces || enquiry.maxCarSpaces
                        ? `${enquiry.minCarSpaces || "Any"} – ${enquiry.maxCarSpaces || "Any"}`
                        : "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Property Type</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.propertyType || "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Keywords</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.keywords || "—"}
                    </dd>
                  </div>
                </dl>
              </section>
            </>
          )}

          {enquiry.legalDocuments?.length > 0 && (
            <>
              <hr className="border-neutral-100" />

              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Legal Documents
                </p>

                <div className="space-y-3">
                  {enquiry.legalDocuments.map((document, index) => (
                    <div
                      key={`${document.storedName}-${index}`}
                      className="rounded border border-neutral-200 bg-neutral-50 px-4 py-3"
                    >
                      <p className="truncate text-[13px] font-medium text-neutral-900">
                        {document.originalName}
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        {document.fileType} · {formatFileSize(document.fileSize)}
                      </p>
                      <p className="mt-1 break-all text-[11px] text-neutral-400">
                        {document.fileUrl}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <a
                          href={document.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-neutral-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                        >
                          Open
                        </a>

                        <a
                          href={document.fileUrl}
                          download={document.originalName}
                          className="rounded border border-neutral-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {enquiry.enquiryType === "developer" && (
            <>
              <hr className="border-neutral-100" />

              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Developer Details
                </p>

                <dl className="space-y-2 text-[13px]">
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Project Name</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.projectName || "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Location</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.projectLocation || "—"}
                    </dd>
                  </div>

                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">Commission</dt>
                    <dd className="font-medium text-neutral-900">
                      {enquiry.commissionStructureInterest || "—"}
                    </dd>
                  </div>
                </dl>
              </section>
            </>
          )}

          {enquiry.message && (
            <>
              <hr className="border-neutral-100" />

              <section>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Message
                </p>
                <p className="whitespace-pre-wrap text-[13px] leading-6 text-neutral-700">
                  {enquiry.message}
                </p>
              </section>
            </>
          )}

          <hr className="border-neutral-100" />

          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Agentbox CRM
            </p>
            {enquiry.agentboxEnquiryId ? (
              <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-emerald-600">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[12px] font-medium text-emerald-800">Synced to Agentbox</p>
                  <p className="text-[11px] text-emerald-700">ID: {enquiry.agentboxEnquiryId}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-amber-500">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <p className="text-[12px] font-medium text-amber-800">Not yet synced to Agentbox</p>
              </div>
            )}
          </section>

          <hr className="border-neutral-100" />

          <div className="flex flex-1 flex-col overflow-hidden">

  {/* SCROLLABLE CONTENT */}
  <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
    {/* EVERYTHING except Update Status buttons */}
  </div>

  {/* FIXED BOTTOM BAR */}
  <div className="border-t border-neutral-200 bg-white px-6 py-4">

    {saved && (
      <div className="mb-4 flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-4 py-2.5">
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-emerald-600">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
        <p className="text-[12px] font-medium text-emerald-800">
          Status updated to <span className="font-semibold">{STATUS_LABEL[pendingStatus]}</span>. Closing…
        </p>
      </div>
    )}

    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
      Update Status
    </p>

    <div className="grid grid-cols-2 gap-2">
      {STATUS_OPTIONS.map((s) => (
        <button
          key={s}
          onClick={() => setPendingStatus(s)}
          className={`rounded border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
            pendingStatus === s
              ? STATUS_BUTTON[s]
              : "border-neutral-200 bg-white text-neutral-400"
          }`}
        >
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="rounded border border-red-200 bg-red-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700 hover:bg-red-100"
      >
        Delete Enquiry
      </button>

      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="rounded border border-blue-600 bg-blue-600 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  </div>

</div>
        </div>
      </aside>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete enquiry?"
        message={`Are you sure you want to delete the enquiry from ${enquiry.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onCancel={() => {
          if (!deleting) setShowDeleteConfirm(false);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [enquiryFilter, setEnquiryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((data) => setEnquiries(data.enquiries ?? []))
      .catch(() => setError("Failed to load enquiries."))
      .finally(() => setLoading(false));
  }, []);

  function handleStatusUpdate(id: string, status: EnquiryStatus) {
    setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
    setSelected((prev) => (prev?._id === id ? { ...prev, status } : prev));
  }

  function handleDelete(id: string) {
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    setSelected((prev) => (prev?._id === id ? null : prev));
  }

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (enquiryFilter !== "all" && e.enquiryType !== enquiryFilter) return false;

      if (typeFilter !== "all") {
        if (typeFilter === "off-plan" && e.propertyInterest !== "off-plan") return false;
        if (typeFilter === "established" && e.propertyInterest !== "established") return false;
        if (typeFilter === "developer" && e.enquiryType !== "developer") return false;
        if (typeFilter === "general" && e.enquiryType !== "general") return false;
      }

      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(e.createdAt) < from) return false;
      }

      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(e.createdAt) > to) return false;
      }

      return true;
    });
  }, [enquiries, statusFilter, enquiryFilter, typeFilter, dateFrom, dateTo]);

  const counts = useMemo(
    () => ({
      total: enquiries.length,
      pending: enquiries.filter((e) => e.status === "pending").length,
      qualified: enquiries.filter((e) => e.status === "qualified").length,
      "in-progress": enquiries.filter((e) => e.status === "in-progress").length,
      closed: enquiries.filter((e) => e.status === "closed").length,
    }),
    [enquiries]
  );

  const hasFilters =
    statusFilter !== "all" ||
    enquiryFilter !== "all" ||
    typeFilter !== "all" ||
    dateFrom ||
    dateTo;

  const allFilteredIds = filtered.map((e) => e._id);
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((e) => selectedIds.includes(e._id));
  const selectedCount = selectedIds.length;

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleSelectAllFiltered() {
    if (allFilteredSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id))
      );
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
  }

  async function handleBulkDelete() {
    setBulkDeleting(true);

    try {
      await bulkDeleteEnquiries(selectedIds);
      setEnquiries((prev) => prev.filter((e) => !selectedIds.includes(e._id)));
      setSelected((prev) =>
        prev && selectedIds.includes(prev._id) ? null : prev
      );
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } catch {
      alert("Failed to delete selected enquiries.");
    } finally {
      setBulkDeleting(false);
    }
  }

  async function handleRowDelete(
    e: React.MouseEvent<HTMLButtonElement>,
    enquiryId: string,
    enquiryName: string
  ) {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete enquiry from ${enquiryName}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteEnquiry(enquiryId);
      handleDelete(enquiryId);
    } catch {
      alert("Failed to delete enquiry.");
    }
  }

  if (loading) {
    return (
      <div className="mt-10 text-center text-sm text-neutral-400">
        Loading enquiries…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: counts.total, color: "text-neutral-900" },
          { label: "Pending", value: counts.pending, color: "text-amber-700" },
          { label: "Qualified", value: counts.qualified, color: "text-emerald-700" },
          {
            label: "In Progress",
            value: counts["in-progress"],
            color: "text-blue-700",
          },
          { label: "Closed", value: counts.closed, color: "text-neutral-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-4"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              {s.label}
            </p>
            <p className={`mt-1 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="qualified">Qualified</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Enquiry
          </label>
          <select
            value={enquiryFilter}
            onChange={(e) => setEnquiryFilter(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="all">All enquiries</option>
            <option value="general">General</option>
            <option value="buyer">Buyer / Investor</option>
            <option value="developer">Developer</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="all">All types</option>
            <option value="off-plan">Off-the-Plan</option>
            <option value="established">Established</option>
            <option value="developer">Developer Enquiry</option>
            <option value="general">General Enquiry</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              setStatusFilter("all");
              setEnquiryFilter("all");
              setTypeFilter("all");
              setDateFrom("");
              setDateTo("");
            }}
            className="self-end rounded border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto self-end text-[12px] text-neutral-400">
          {filtered.length} of {enquiries.length} enquiries
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAllFiltered}
            disabled={filtered.length === 0}
            className="rounded border border-neutral-200 px-3 py-2 text-[12px] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allFilteredSelected ? "Deselect visible" : "Select visible"}
          </button>

          <span className="text-[12px] text-neutral-500">
            {selectedCount} selected
          </span>
        </div>

        <button
          onClick={() => setShowBulkDeleteConfirm(true)}
          disabled={selectedCount === 0 || bulkDeleting}
          className="rounded border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bulkDeleting ? "Deleting…" : `Delete Selected${selectedCount ? ` (${selectedCount})` : ""}`}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            {enquiries.length === 0
              ? "No enquiries have been submitted yet."
              : "No enquiries match the current filters."}
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                <th className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    aria-label="Select all visible enquiries"
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                </th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Enquiry</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Summary</th>
                <th className="px-5 py-3">Docs</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const isChecked = selectedIds.includes(e._id);

                return (
                  <tr
                    key={e._id}
                    onClick={() => setSelected(e)}
                    className={`cursor-pointer border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                    }`}
                  >
                    <td
                      className="px-5 py-3.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(e._id)}
                        aria-label={`Select enquiry from ${e.name}`}
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 text-neutral-500">
                      {formatDate(e.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-neutral-900">
                      {e.name}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {getEnquiryTypeLabel(e.enquiryType)}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">{e.email}</td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {formatPhone(e.phoneCountryCode, e.phone)}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">{getTypeLabel(e)}</td>
                    <td className="px-5 py-3.5 capitalize text-neutral-600">
                      {getSummaryLabel(e)}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {e.legalDocuments?.length ?? 0}
                    </td>
                    <td
                      className="px-5 py-3.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <InlineStatusSelect enquiry={e} onStatusUpdate={handleStatusUpdate} />
                    </td>
                    <td
                      className="px-5 py-3.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        onClick={(event) => handleRowDelete(event, e._id, e.name)}
                        className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <DetailPanel
          enquiry={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      )}

      <ConfirmDialog
        open={showBulkDeleteConfirm}
        title="Delete selected enquiries?"
        message={`Are you sure you want to delete ${selectedCount} selected ${
          selectedCount === 1 ? "enquiry" : "enquiries"
        }? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={bulkDeleting}
        onCancel={() => {
          if (!bulkDeleting) setShowBulkDeleteConfirm(false);
        }}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}