"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AssignedDocument = {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  title?: string;
  docType?: string;
  docStatus?: string;
  requiresSignature?: boolean;
};

type DeveloperAccountStatus = "active" | "rejected";

type Developer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  accountStatus?: DeveloperAccountStatus;
  pendingApproval: boolean;
  adminNotes: string;
  assignedDocuments: AssignedDocument[];
  createdAt: string;
};

type LegalDocument = {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
};

type Enquiry = {
  _id: string;
  enquiryType: "general" | "developer" | "buyer";
  status: string;
  projectName: string;
  projectLocation: string;
  commissionStructureInterest: string;
  legalDocuments: LegalDocument[];
  createdAt: string;
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const DEV_STATUS_OPTIONS: DeveloperAccountStatus[] = ["active", "rejected"];

const DEV_STATUS_LABEL: Record<DeveloperAccountStatus, string> = {
  active: "Active",
  rejected: "Rejected",
};

const DEV_STATUS_BADGE: Record<DeveloperAccountStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const DEV_STATUS_BUTTON: Record<DeveloperAccountStatus, string> = {
  active: "border-emerald-400 bg-emerald-50 text-emerald-800",
  rejected: "border-red-400 bg-red-50 text-red-700",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDeveloperStatus(developer: Pick<Developer, "accountStatus">): DeveloperAccountStatus {
  return developer.accountStatus === "rejected" ? "rejected" : "active";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        DEV_STATUS_BADGE[status] ?? "bg-neutral-100 text-neutral-500"
      }`}
    >
      {DEV_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function EnquiryStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    qualified: "bg-emerald-100 text-emerald-800",
    "in-progress": "bg-blue-100 text-blue-800",
    closed: "bg-neutral-200 text-neutral-600",
  };
  const label: Record<string, string> = {
    pending: "Pending",
    qualified: "Qualified",
    "in-progress": "In Progress",
    closed: "Closed",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        map[status] ?? "bg-neutral-100 text-neutral-500"
      }`}
    >
      {label[status] ?? status}
    </span>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-md rounded-sm bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg viewBox="0 0 20 20" className="h-7 w-7 fill-red-600">
            <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-10.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-light text-[#1f1a17]">{title}</h3>
        <p className="mt-3 text-[14px] leading-7 text-[#6c6258]">{message}</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-sm border border-neutral-200 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 transition hover:border-neutral-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-sm bg-red-600 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Removing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail panel ──────────────────────────────────────────────────────────────

function DeveloperDetailPanel({
  developer: initialDeveloper,
  onClose,
}: {
  developer: Developer;
  onClose: () => void;
}) {
  const [developer, setDeveloper] = useState<Developer>(initialDeveloper);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState("");

  const [pendingStatus, setPendingStatus] = useState<DeveloperAccountStatus>(
    getDeveloperStatus(initialDeveloper)
  );
  const [savingStatus, setSavingStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const [notes, setNotes] = useState(initialDeveloper.adminNotes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDocType, setUploadDocType] = useState("Legal");
  const [uploadRequiresSignature, setUploadRequiresSignature] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docToDelete, setDocToDelete] = useState<AssignedDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/developers/${initialDeveloper._id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.developer) setDeveloper(data.developer);
        if (data.enquiries) setEnquiries(data.enquiries);
        setNotes(data.developer?.adminNotes ?? "");
      })
      .catch(() => setDetailError("Failed to load developer details."))
      .finally(() => setLoadingDetail(false));
  }, [initialDeveloper._id]);

  async function handleSaveStatus() {
    if (pendingStatus === getDeveloperStatus(developer)) return;
    setSavingStatus(true);
    const res = await fetch(`/api/admin/developers/${developer._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountStatus: pendingStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setDeveloper(data.developer);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    }
    setSavingStatus(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    const res = await fetch(`/api/admin/developers/${developer._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes: notes }),
    });
    if (res.ok) {
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 2000);
    }
    setSavingNotes(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setUploadFile(file);
    setUploadError("");
  }

  async function handleUploadSubmit() {
    if (!uploadFile) {
      setUploadError("Please select a file.");
      return;
    }
    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("document", uploadFile);
    formData.append("title", uploadTitle.trim());
    formData.append("docType", uploadDocType);
    formData.append("requiresSignature", String(uploadRequiresSignature));

    const res = await fetch(`/api/admin/developers/${developer._id}/documents`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setDeveloper((prev) => ({
        ...prev,
        assignedDocuments: [...(prev.assignedDocuments ?? []), data.document],
      }));
      setUploadFile(null);
      setUploadTitle("");
      setUploadDocType("Legal");
      setUploadRequiresSignature(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      const data = await res.json();
      setUploadError(data.message ?? "Upload failed.");
    }

    setUploading(false);
  }

  async function handleDeleteDoc() {
    if (!docToDelete) return;
    setDeletingDoc(true);
    const res = await fetch(`/api/admin/developers/${developer._id}/documents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storedName: docToDelete.storedName }),
    });
    if (res.ok) {
      setDeveloper((prev) => ({
        ...prev,
        assignedDocuments: prev.assignedDocuments.filter(
          (d) => d.storedName !== docToDelete.storedName
        ),
      }));
    }
    setDeletingDoc(false);
    setDocToDelete(null);
  }

  const allLegalDocs = enquiries.flatMap((e) => e.legalDocuments ?? []);

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />

      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Developer Profile
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-neutral-900">
              {developer.name || "Unnamed Developer"}
            </h2>
            {developer.companyName && (
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {developer.companyName}
              </p>
            )}
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loadingDetail ? (
            <div className="py-10 text-center text-sm text-neutral-400">Loading…</div>
          ) : detailError ? (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {detailError}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Profile */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Profile
                </p>
                <dl className="space-y-2 text-[13px]">
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Name</dt>
                    <dd className="font-medium text-neutral-900">
                      {developer.name || "—"}
                    </dd>
                  </div>
                  {developer.companyName && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-neutral-400">Company</dt>
                      <dd className="font-medium text-neutral-900">
                        {developer.companyName}
                      </dd>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Email</dt>
                    <dd className="break-all font-medium text-neutral-900">
                      <a href={`mailto:${developer.email}`} className="hover:underline">
                        {developer.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Phone</dt>
                    <dd className="font-medium text-neutral-900">
                      {developer.phone ? (
                        <a
                          href={`tel:${developer.phone.replace(/\s/g, "")}`}
                          className="hover:underline"
                        >
                          {developer.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Status</dt>
                    <dd>
                      <StatusBadge status={getDeveloperStatus(developer)} />
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Registered</dt>
                    <dd className="font-medium text-neutral-900">
                      {formatDate(developer.createdAt)}
                    </dd>
                  </div>
                </dl>
              </section>

              <hr className="border-neutral-100" />

              {/* Account status control */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Update Account Status
                </p>
                <div className="flex gap-2">
                  {DEV_STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPendingStatus(s)}
                      className={`rounded border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${
                        pendingStatus === s
                          ? DEV_STATUS_BUTTON[s]
                          : "border-neutral-200 bg-white text-neutral-400"
                      }`}
                    >
                      {DEV_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSaveStatus}
                  disabled={savingStatus || pendingStatus === getDeveloperStatus(developer)}
                  className="mt-3 w-full rounded border border-blue-600 bg-blue-600 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingStatus ? "Saving…" : savedStatus ? "Saved" : "Save Status"}
                </button>
              </section>

              <hr className="border-neutral-100" />

              {/* Submitted enquiries */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Submitted Enquiries ({enquiries.length})
                </p>
                {enquiries.length === 0 ? (
                  <p className="text-[13px] text-neutral-400">No enquiries submitted.</p>
                ) : (
                  <div className="space-y-2">
                    {enquiries.map((eq) => (
                      <div
                        key={eq._id}
                        className="rounded border border-neutral-200 bg-neutral-50 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-medium text-neutral-900">
                            {eq.enquiryType === "developer"
                              ? eq.projectName || "Developer Enquiry"
                              : eq.enquiryType === "buyer"
                                ? "Buyer Enquiry"
                                : "General Enquiry"}
                          </span>
                          <EnquiryStatusBadge status={eq.status} />
                        </div>
                        {eq.projectLocation && (
                          <p className="mt-1 text-[12px] text-neutral-500">
                            {eq.projectLocation}
                          </p>
                        )}
                        {eq.commissionStructureInterest && (
                          <p className="mt-0.5 truncate text-[12px] text-neutral-400">
                            Commission: {eq.commissionStructureInterest}
                          </p>
                        )}
                        <p className="mt-1 text-[12px] text-neutral-500">
                          {formatDate(eq.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Client-uploaded documents (from enquiries) */}
              {allLegalDocs.length > 0 && (
                <>
                  <hr className="border-neutral-100" />
                  <section>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      Uploaded Documents ({allLegalDocs.length})
                    </p>
                    <div className="space-y-2">
                      {allLegalDocs.map((doc, i) => (
                        <div
                          key={`${doc.storedName}-${i}`}
                          className="rounded border border-neutral-200 bg-neutral-50 px-4 py-3"
                        >
                          <p className="truncate text-[13px] font-medium text-neutral-900">
                            {doc.originalName}
                          </p>
                          <p className="mt-1 text-[12px] text-neutral-500">
                            {doc.fileType} · {formatFileSize(doc.fileSize)}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400"
                            >
                              Open
                            </a>
                            <a
                              href={doc.fileUrl}
                              download={doc.originalName}
                              className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400"
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

              <hr className="border-neutral-100" />

              {/* Assigned documents */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Assigned Documents ({developer.assignedDocuments?.length ?? 0})
                </p>

                {(developer.assignedDocuments?.length ?? 0) === 0 ? (
                  <p className="mb-3 text-[13px] text-neutral-400">
                    No documents assigned yet.
                  </p>
                ) : (
                  <div className="mb-3 space-y-2">
                    {developer.assignedDocuments.map((doc) => (
                      <div
                        key={doc.storedName}
                        className="rounded border border-neutral-200 bg-neutral-50 px-4 py-3"
                      >
                        <p className="truncate text-[13px] font-medium text-neutral-900">
                          {doc.title || doc.originalName}
                        </p>
                        {doc.title && (
                          <p className="truncate text-[11px] text-neutral-400">{doc.originalName}</p>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                          <span>{formatFileSize(doc.fileSize)}</span>
                          {doc.docType && (
                            <span className="rounded bg-neutral-200 px-1.5 py-0.5 font-medium text-neutral-600">
                              {doc.docType}
                            </span>
                          )}
                          {doc.docStatus && (
                            <span className={`rounded px-1.5 py-0.5 font-medium ${
                              doc.docStatus === "Signed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {doc.docStatus}
                            </span>
                          )}
                          {doc.requiresSignature && doc.docStatus !== "Signed" && (
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-600">
                              Signature Required
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400"
                          >
                            Open
                          </a>
                          <a
                            href={doc.fileUrl}
                            download={doc.originalName}
                            className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => setDocToDelete(doc)}
                            className="ml-auto rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload form */}
                <div className="rounded border border-neutral-200 bg-neutral-50 px-4 py-4 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Assign New Document
                  </p>
                  <input
                    type="text"
                    placeholder="Document title (optional)"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    maxLength={200}
                    className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400"
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={uploadDocType}
                      onChange={(e) => setUploadDocType(e.target.value)}
                      className="flex-1 rounded border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-700 outline-none focus:border-neutral-400"
                    >
                      <option>Legal</option>
                      <option>Ownership</option>
                      <option>Financial</option>
                    </select>
                    <p className="text-[12px] text-neutral-500">
                      For documents requiring a signature, use <span className="font-medium text-neutral-700">Send via DocuSign (eSignature)</span>.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer rounded border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-500 truncate hover:border-neutral-400 transition">
                      {uploadFile ? uploadFile.name : "Choose file…"}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="sr-only"
                        disabled={uploading}
                        onChange={handleFileSelect}
                      />
                    </label>
                    <button
                      onClick={handleUploadSubmit}
                      disabled={uploading || !uploadFile}
                      className="rounded border border-neutral-800 bg-neutral-800 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {uploading ? "Uploading…" : "Upload"}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    PDF, DOC, DOCX, JPG, PNG · max 10 MB
                  </p>
                  {uploadError && (
                    <p className="text-[12px] text-red-600">{uploadError}</p>
                  )}
                </div>
              </section>

              <hr className="border-neutral-100" />

              {/* Admin notes */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Internal Notes
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Add internal notes about this developer…"
                  className="w-full resize-y rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">{notes.length}/2000</span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="rounded border border-neutral-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 transition hover:border-neutral-500 hover:text-neutral-900 disabled:opacity-50"
                  >
                    {savingNotes ? "Saving…" : savedNotes ? "Saved" : "Save Notes"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={Boolean(docToDelete)}
        title="Remove document?"
        message={`Remove "${docToDelete?.originalName}" from this developer's profile? This cannot be undone.`}
        confirmLabel="Remove"
        loading={deletingDoc}
        onCancel={() => { if (!deletingDoc) setDocToDelete(null); }}
        onConfirm={handleDeleteDoc}
      />
    </>
  );
}

async function bulkRemoveDevelopers(ids: string[]) {
  const res = await fetch("/api/admin/developers", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to remove selected developers");
  return true;
}

async function removeDeveloper(id: string) {
  const res = await fetch(`/api/admin/developers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove developer");
  return true;
}

// ─── Main panel ────────────────────────────────────────────────────────────────

export default function DevelopersPanel() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Developer | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRemoving, setBulkRemoving] = useState(false);
  const [showBulkRemoveConfirm, setShowBulkRemoveConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/developers")
      .then((r) => r.json())
      .then((data) => setDevelopers(data.developers ?? []))
      .catch(() => setError("Failed to load developers."))
      .finally(() => setLoading(false));
  }, []);

  function handleRemove(id: string) {
    setDevelopers((prev) => prev.filter((d) => d._id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    setSelected((prev) => (prev?._id === id ? null : prev));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return developers.filter((d) => {
      if (statusFilter !== "all" && getDeveloperStatus(d) !== statusFilter) return false;
      if (q) {
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.email.toLowerCase().includes(q) &&
          !(d.companyName ?? "").toLowerCase().includes(q) &&
          !(d.phone ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [developers, statusFilter, search]);

  const counts = useMemo(
    () => ({
      total: developers.length,
      active: developers.filter((d) => getDeveloperStatus(d) === "active").length,
      rejected: developers.filter((d) => getDeveloperStatus(d) === "rejected").length,
    }),
    [developers]
  );

  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  const allFilteredIds = filtered.map((d) => d._id);
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((d) => selectedIds.includes(d._id));
  const selectedCount = selectedIds.length;

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleSelectAllFiltered() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
  }

  async function handleBulkRemove() {
    setBulkRemoving(true);
    try {
      await bulkRemoveDevelopers(selectedIds);
      setDevelopers((prev) => prev.filter((d) => !selectedIds.includes(d._id)));
      setSelected((prev) => (prev && selectedIds.includes(prev._id) ? null : prev));
      setSelectedIds([]);
      setShowBulkRemoveConfirm(false);
    } catch {
      alert("Failed to remove selected developers.");
    } finally {
      setBulkRemoving(false);
    }
  }

  async function handleRowRemove(e: React.MouseEvent, devId: string, devName: string) {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Remove developer "${devName}" from the dashboard? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await removeDeveloper(devId);
      handleRemove(devId);
    } catch {
      alert("Failed to remove developer.");
    }
  }

  if (loading) {
    return (
      <div className="mt-10 text-center text-sm text-neutral-400">Loading developers…</div>
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
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: counts.total, color: "text-neutral-900" },
          { label: "Active", value: counts.active, color: "text-emerald-700" },
          { label: "Rejected", value: counts.rejected, color: "text-red-600" },
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

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Search
          </label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, company, email, or phone…"
            className="w-64 rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <a
          href="/developer/dashboard"
          target="_blank"
          rel="noreferrer"
          className="self-end flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
          </svg>
          Developer Portal
        </a>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="self-end rounded border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto self-end text-[12px] text-neutral-400">
          {filtered.length} of {developers.length} developers
        </span>
      </div>

      {/* Selection toolbar */}
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
          onClick={() => setShowBulkRemoveConfirm(true)}
          disabled={selectedCount === 0 || bulkRemoving}
          className="rounded border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bulkRemoving
            ? "Removing…"
            : `Remove Selected${selectedCount ? ` (${selectedCount})` : ""}`}
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            {developers.length === 0
              ? "No registered developers yet."
              : "No developers match the current filters."}
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
                    aria-label="Select all visible developers"
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                </th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Registered</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const isChecked = selectedIds.includes(d._id);
                return (
                  <tr
                    key={d._id}
                    onClick={() => setSelected(d)}
                    className={`cursor-pointer border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                    }`}
                  >
                    <td
                      className="px-5 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(d._id)}
                        aria-label={`Select developer ${d.name}`}
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                    </td>
                    <td className="px-5 py-3.5 font-medium text-neutral-900">
                      {d.name || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {d.companyName || <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">{d.email}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-neutral-600">
                      {d.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={getDeveloperStatus(d)} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-neutral-500">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(d)}
                          className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleRowRemove(e, d._id, d.name)}
                          className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <DeveloperDetailPanel
          developer={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <ConfirmDialog
        open={showBulkRemoveConfirm}
        title="Remove selected developers?"
        message={`Are you sure you want to remove ${selectedCount} selected ${
          selectedCount === 1 ? "developer" : "developers"
        } from the dashboard? They will not be deleted from the database.`}
        confirmLabel="Remove"
        loading={bulkRemoving}
        onCancel={() => { if (!bulkRemoving) setShowBulkRemoveConfirm(false); }}
        onConfirm={handleBulkRemove}
      />
    </div>
  );
}
