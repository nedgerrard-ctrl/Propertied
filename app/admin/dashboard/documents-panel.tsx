"use client";

import { useEffect, useRef, useState } from "react";
import ESignaturePanel from "./esignature-panel";

type UserOption = {
  _id: string;
  name: string;
  email: string;
  clientType: string;
};

type DocumentWithUser = {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  title?: string;
  docType?: string;
  docStatus?: string;
  requiresSignature?: boolean;
  uploadedByClient?: boolean;
  uploadedAt?: string;
  userId: string;
  userName: string;
  userEmail: string;
  clientType: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DOC_TYPE_BADGE: Record<string, string> = {
  Legal: "bg-purple-100 text-purple-700",
  Ownership: "bg-blue-100 text-blue-700",
  Financial: "bg-emerald-100 text-emerald-700",
};

const DOC_STATUS_BADGE: Record<string, string> = {
  Signed:   "bg-emerald-100 text-emerald-700",
  Approved: "bg-blue-100 text-blue-700",
  Pending:  "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
  Draft:    "bg-neutral-100 text-neutral-500",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function docEndpoint(doc: Pick<DocumentWithUser, "userId" | "clientType">) {
  return doc.clientType === "developer"
    ? `/api/admin/developers/${doc.userId}/documents`
    : `/api/admin/clients/${doc.userId}/documents`;
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  loading,
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
            {loading ? "Removing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentsPanel() {
  const [documents, setDocuments] = useState<DocumentWithUser[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sigFilter, setSigFilter] = useState("All");

  // Upload form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDocType, setUploadDocType] = useState("Legal");
  const [uploadRequiresSignature, setUploadRequiresSignature] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete
  const [docToDelete, setDocToDelete] = useState<DocumentWithUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Approve / Reject
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/documents").then((r) => r.json()),
      fetch("/api/admin/clients").then((r) => r.json()),
      fetch("/api/admin/developers").then((r) => r.json()),
    ])
      .then(([docsData, clientsData, devsData]) => {
        setDocuments(docsData.documents ?? []);
        const allUsers: UserOption[] = [
          ...(clientsData.clients ?? []).map((c: UserOption) => ({
            _id: c._id,
            name: c.name,
            email: c.email,
            clientType: c.clientType,
          })),
          ...(devsData.developers ?? []).map((d: UserOption) => ({
            _id: d._id,
            name: d.name,
            email: d.email,
            clientType: "developer",
          })),
        ];
        setUsers(allUsers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Filters ──────────────────────────────────────────────────────────────────

  const filtered = documents.filter((doc) => {
    const q = search.toLowerCase();
    const matchSearch =
      (doc.title ?? "").toLowerCase().includes(q) ||
      doc.originalName.toLowerCase().includes(q) ||
      doc.userName.toLowerCase().includes(q) ||
      doc.userEmail.toLowerCase().includes(q);
    const matchType = typeFilter === "All" || (doc.docType ?? "Legal") === typeFilter;
    const matchStatus =
      statusFilter === "All" || (doc.docStatus ?? "Pending") === statusFilter;
    const matchSig =
      sigFilter === "All" ||
      (sigFilter === "Required" && doc.requiresSignature) ||
      (sigFilter === "Not Required" && !doc.requiresSignature);
    return matchSearch && matchType && matchStatus && matchSig;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const adminAssigned = documents.filter((d) => !d.uploadedByClient);
  const pendingSig = adminAssigned.filter(
    (d) => d.requiresSignature && (d.docStatus ?? "Pending") !== "Signed"
  ).length;
  const signed = documents.filter((d) => d.docStatus === "Signed").length;
  const clientUploaded = documents.filter((d) => d.uploadedByClient).length;

  // ── Upload handlers ───────────────────────────────────────────────────────────

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadFile(e.target.files?.[0] ?? null);
    setUploadError("");
  }

  async function handleUploadSubmit() {
    if (!selectedUserId) { setUploadError("Please select a user."); return; }
    if (!uploadFile) { setUploadError("Please select a file."); return; }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const selectedUser = users.find((u) => u._id === selectedUserId);
    const isDeveloper = selectedUser?.clientType === "developer";
    const endpoint = isDeveloper
      ? `/api/admin/developers/${selectedUserId}/documents`
      : `/api/admin/clients/${selectedUserId}/documents`;

    const formData = new FormData();
    formData.append("document", uploadFile);
    formData.append("title", uploadTitle.trim());
    formData.append("docType", uploadDocType);
    formData.append("requiresSignature", String(uploadRequiresSignature));

    const res = await fetch(endpoint, { method: "POST", body: formData });

    if (res.ok) {
      const data = await res.json();
      const newDoc: DocumentWithUser = {
        ...data.document,
        userId: selectedUserId,
        userName: selectedUser?.name || selectedUser?.email || selectedUserId,
        userEmail: selectedUser?.email || "",
        clientType: selectedUser?.clientType || "",
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setUploadSuccess(
        `Document assigned to ${selectedUser?.name || selectedUser?.email}.`
      );
      setUploadFile(null);
      setUploadTitle("");
      setUploadDocType("Legal");
      setUploadRequiresSignature(false);
      setSelectedUserId("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      const data = await res.json();
      setUploadError(data.message ?? "Upload failed.");
    }
    setUploading(false);
  }

  // ── Approve / Reject handler ──────────────────────────────────────────────────

  async function handleStatusChange(doc: DocumentWithUser, newStatus: "Approved" | "Rejected") {
    const key = `${doc.userId}-${doc.storedName}`;
    setUpdatingStatus(key);
    const res = await fetch(docEndpoint(doc), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storedName: doc.storedName, docStatus: newStatus }),
    });
    setUpdatingStatus(null);
    if (res.ok) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.storedName === doc.storedName && d.userId === doc.userId
            ? { ...d, docStatus: newStatus }
            : d
        )
      );
    }
  }

  // ── Delete handler ────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!docToDelete) return;
    setDeleting(true);
    const res = await fetch(docEndpoint(docToDelete), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storedName: docToDelete.storedName }),
    });
    if (res.ok) {
      setDocuments((prev) =>
        prev.filter(
          (d) =>
            !(d.storedName === docToDelete.storedName && d.userId === docToDelete.userId)
        )
      );
    }
    setDeleting(false);
    setDocToDelete(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="mt-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Admin Assigned", value: adminAssigned.length },
          { label: "Pending Signature", value: pendingSig, highlight: pendingSig > 0 },
          { label: "Signed", value: signed },
          { label: "Client Uploaded", value: clientUploaded },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className="rounded border border-neutral-200 bg-white px-5 py-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              {label}
            </p>
            <p
              className={`mt-1 text-3xl font-light ${
                highlight ? "text-amber-600" : "text-[#1f1a17]"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Assign new document */}
      <div className="rounded border border-neutral-200 bg-white">
        <button
          onClick={() => {
            setShowUploadForm((v) => !v);
            setUploadError("");
            setUploadSuccess("");
          }}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Assign New Document
          </span>
          <svg
            viewBox="0 0 20 20"
            className={`h-4 w-4 fill-neutral-400 transition-transform ${showUploadForm ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {showUploadForm && (
          <div className="border-t border-neutral-100 px-6 pb-6 pt-4 space-y-4">
            {uploadSuccess && (
              <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-700">
                {uploadSuccess}
              </div>
            )}

            {/* User picker */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Assign to User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700 outline-none focus:border-neutral-400"
              >
                <option value="">— Select a user —</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name || u.email}{" "}
                    {u.clientType === "developer" ? "(Developer)" : `(${u.email})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Document Title
              </label>
              <input
                type="text"
                placeholder="e.g. Purchase Agreement"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                maxLength={200}
                className="w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400"
              />
            </div>

            {/* Type + Signature */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Document Type
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-700 outline-none focus:border-neutral-400"
                >
                  <option>Legal</option>
                  <option>Ownership</option>
                  <option>Financial</option>
                </select>
              </div>
              <div className="pt-5">
                <p className="text-[12px] text-neutral-500">
                  For documents requiring a signature, use <span className="font-medium text-neutral-700">Send via DocuSign (eSignature)</span>.
                </p>
              </div>
            </div>

            {/* File + submit */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                File
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-500 truncate hover:border-neutral-400 transition">
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
                  disabled={uploading || !uploadFile || !selectedUserId}
                  className="rounded border border-neutral-800 bg-neutral-800 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-neutral-400">
                PDF, DOC, DOCX, JPG, PNG · max 10 MB
              </p>
              {uploadError && (
                <p className="mt-1 text-[12px] text-red-600">{uploadError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DocuSign eSignature */}
      <ESignaturePanel />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, user, title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-neutral-200 py-2 pl-9 pr-4 text-[13px] text-neutral-900 outline-none focus:border-neutral-400"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded border border-neutral-200 bg-white py-2 pl-3 pr-8 text-[13px] text-neutral-700 outline-none focus:border-neutral-400 cursor-pointer"
        >
          <option value="All">All Types</option>
          <option>Legal</option>
          <option>Ownership</option>
          <option>Financial</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-neutral-200 bg-white py-2 pl-3 pr-8 text-[13px] text-neutral-700 outline-none focus:border-neutral-400 cursor-pointer"
        >
          <option value="All">All Status</option>
          <option>Pending</option>
          <option>Signed</option>
          <option>Draft</option>
        </select>
        <select
          value={sigFilter}
          onChange={(e) => setSigFilter(e.target.value)}
          className="rounded border border-neutral-200 bg-white py-2 pl-3 pr-8 text-[13px] text-neutral-700 outline-none focus:border-neutral-400 cursor-pointer"
        >
          <option value="All">All Signature</option>
          <option value="Required">Signature Required</option>
          <option value="Not Required">No Signature</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-[13px]">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Document
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Signature
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Uploaded
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-neutral-400">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-neutral-400">
                  {documents.length === 0
                    ? "No documents assigned yet."
                    : "No documents match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((doc, i) => {
                const docType = doc.docType ?? "Legal";
                const docStatus = doc.docStatus ?? "Pending";
                const isSigned = docStatus === "Signed";
                const needsSig = doc.requiresSignature && !isSigned;

                return (
                  <tr key={`${doc.userId}-${doc.storedName}-${i}`} className="hover:bg-neutral-50 transition-colors">
                    {/* Document name */}
                    <td className="px-5 py-3.5 max-w-[220px]">
                      <p className="font-medium text-neutral-900 truncate">
                        {doc.title || doc.originalName}
                      </p>
                      {doc.title && (
                        <p className="text-[11px] text-neutral-400 truncate">
                          {doc.originalName}
                        </p>
                      )}
                      {doc.uploadedByClient && (
                        <span className="mt-0.5 inline-block text-[10px] font-medium text-neutral-400">
                          Client upload
                        </span>
                      )}
                    </td>

                    {/* Assigned to */}
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <p className="font-medium text-neutral-900 truncate">
                        {doc.userName}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {doc.userEmail}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                          DOC_TYPE_BADGE[docType] ?? "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {docType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                          DOC_STATUS_BADGE[docStatus] ?? "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {docStatus}
                      </span>
                    </td>

                    {/* Signature */}
                    <td className="px-4 py-3.5">
                      {doc.requiresSignature ? (
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isSigned
                              ? "bg-emerald-100 text-emerald-700"
                              : needsSig
                                ? "bg-amber-100 text-amber-700"
                                : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {isSigned ? "Signed" : "Awaiting"}
                        </span>
                      ) : (
                        <span className="text-[12px] text-neutral-300">—</span>
                      )}
                    </td>

                    {/* Uploaded */}
                    <td className="px-4 py-3.5 text-neutral-500">
                      {formatDate(doc.uploadedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {docStatus === "Pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(doc, "Approved")}
                              disabled={updatingStatus === `${doc.userId}-${doc.storedName}`}
                              className="rounded border border-blue-300 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(doc, "Rejected")}
                              disabled={updatingStatus === `${doc.userId}-${doc.storedName}`}
                              className="rounded border border-orange-300 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-orange-700 transition hover:bg-orange-100 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-600 transition hover:border-neutral-400"
                        >
                          Open
                        </a>
                        <a
                          href={doc.fileUrl}
                          download={doc.originalName}
                          className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-600 transition hover:border-neutral-400"
                        >
                          Save
                        </a>
                        <button
                          onClick={() => setDocToDelete(doc)}
                          className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-700 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="border-t border-neutral-100 px-5 py-3 text-[12px] text-neutral-400">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""}
            {filtered.length !== documents.length && ` (of ${documents.length} total)`}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(docToDelete)}
        title="Remove document?"
        message={`Remove "${docToDelete?.title || docToDelete?.originalName}" from ${docToDelete?.userName}? This cannot be undone.`}
        confirmLabel="Remove"
        loading={deleting}
        onCancel={() => setDocToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
