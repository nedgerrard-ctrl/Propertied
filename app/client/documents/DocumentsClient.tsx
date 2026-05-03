"use client";

import { useState, useEffect, useRef } from "react";

interface ApiDocument {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  title?: string;
  uploadedByClient?: boolean;
  docType?: string;
  docStatus?: string;
  requiresSignature?: boolean;
  uploadedAt?: string;
}

type DocumentType = "Legal" | "Ownership" | "Financial";
type DocumentStatus = "Signed" | "Pending" | "Draft";

const TYPE_STYLES: Record<string, string> = {
  Legal: "bg-purple-50 text-purple-700",
  Ownership: "bg-blue-50 text-blue-700",
  Financial: "bg-emerald-50 text-emerald-700",
};

const STATUS_STYLES: Record<string, string> = {
  Signed: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Draft: "bg-neutral-100 text-neutral-500",
};

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
const MAX_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FileIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export default function DocumentsClient() {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [signDoc, setSignDoc] = useState<ApiDocument | null>(null);
  const [signSent, setSignSent] = useState(false);
  const [signError, setSignError] = useState("");
  const [deleteDoc, setDeleteDoc] = useState<ApiDocument | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/client/documents")
      .then((r) => r.json())
      .then((data) => setDocuments(data.documents ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter((doc) => {
    const q = search.toLowerCase();
    const matchSearch = doc.originalName.toLowerCase().includes(q) || (doc.title ?? "").toLowerCase().includes(q);
    const matchType = typeFilter === "All Types" || (doc.docType ?? "Legal") === typeFilter;
    const matchStatus = statusFilter === "All Status" || (doc.docStatus ?? "Pending") === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  async function handleUpload(file: File) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadFeedback({
        kind: "error",
        text: `"${file.name}" is not a supported file type. Please upload PDF, DOC, DOCX, JPG, or PNG files only.`,
      });
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadFeedback({
        kind: "error",
        text: `"${file.name}" exceeds the 10 MB size limit.`,
      });
      return;
    }

    setUploading(true);
    setUploadFeedback(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await fetch("/api/client/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments((prev) => [...prev, data.document]);
        setUploadFeedback({ kind: "success", text: `"${file.name}" uploaded successfully.` });
      } else {
        setUploadFeedback({ kind: "error", text: data.message ?? "Upload failed." });
      }
    } catch {
      setUploadFeedback({ kind: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleView(doc: ApiDocument) {
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownload(doc: ApiDocument) {
    const a = document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function openSignModal(doc: ApiDocument) {
    setSignDoc(doc);
    setSignSent(false);
  }

  async function handleSendForSignature() {
    if (!signDoc) return;
    setSignError("");
    try {
      const res = await fetch("/api/client/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storedName: signDoc.storedName }),
      });
      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) =>
            d.storedName === signDoc.storedName ? { ...d, docStatus: "Signed" } : d
          )
        );
        setSignSent(true);
      } else {
        const data = await res.json();
        setSignError(data.message ?? "Failed to sign document. Please try again.");
      }
    } catch {
      setSignError("Something went wrong. Please try again.");
    }
  }

  function closeSignModal() {
    setSignDoc(null);
    setSignSent(false);
    setSignError("");
  }

  async function handleDelete() {
    if (!deleteDoc) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/client/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storedName: deleteDoc.storedName }),
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.storedName !== deleteDoc.storedName));
        setUploadFeedback({ kind: "success", text: `"${deleteDoc.originalName}" deleted.` });
      } else {
        const data = await res.json();
        setUploadFeedback({ kind: "error", text: data.message ?? "Delete failed." });
      }
    } catch {
      setUploadFeedback({ kind: "error", text: "Delete failed. Please try again." });
    } finally {
      setDeleting(false);
      setDeleteDoc(null);
    }
  }

  return (
    <main className="flex flex-1 flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
        <h1 className="text-xl font-semibold text-neutral-900">My Documents</h1>
        <div className="flex items-center gap-3 text-neutral-400">
          <button className="rounded-full p-1.5 hover:bg-neutral-100 transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="rounded-full p-1.5 hover:bg-neutral-100 transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 space-y-5">
        <p className="text-sm text-neutral-500">
          Upload, view, and sign your property documents securely.
        </p>

        {/* Upload feedback banner */}
        {uploadFeedback && (
          <div
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
              uploadFeedback.kind === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span>{uploadFeedback.text}</span>
            <button
              onClick={() => setUploadFeedback(null)}
              className="ml-4 shrink-0 opacity-70 hover:opacity-100 transition"
            >
              <XIcon />
            </button>
          </div>
        )}

        {/* Upload area */}
        <div
          className={`rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-neutral-200 bg-white"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex justify-center mb-3">
            <UploadIcon />
          </div>
          <p className="font-semibold text-neutral-900">Upload Documents</p>
          <p className="mt-1 text-sm text-neutral-400">
            Drag and drop your files here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading…" : "Choose Files"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileInput}
          />
          <p className="mt-3 text-xs text-neutral-400">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10 MB)
          </p>
        </div>

        {/* Search & filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
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
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-neutral-400 cursor-pointer"
          >
            <option>All Types</option>
            <option>Legal</option>
            <option>Ownership</option>
            <option>Financial</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-neutral-400 cursor-pointer"
          >
            <option>All Status</option>
            <option>Signed</option>
            <option>Pending</option>
            <option>Draft</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Document Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Size
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-400">
                    Loading documents…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-400">
                    {documents.length === 0
                      ? "No documents yet. Upload a file above to get started."
                      : "No documents match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => {
                  const docType = (doc.docType ?? "Legal") as DocumentType;
                  const docStatus = (doc.docStatus ?? "Pending") as DocumentStatus;
                  const needsSignature = doc.requiresSignature === true && docStatus !== "Signed";

                  return (
                    <tr key={doc.storedName} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <FileIcon />
                          <div className="min-w-0">
                            <span className="font-medium text-neutral-800 truncate max-w-xs block">
                              {doc.title || doc.originalName}
                            </span>
                            {doc.title && (
                              <span className="text-xs text-neutral-400 truncate block">{doc.originalName}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            TYPE_STYLES[docType] ?? "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {docType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_STYLES[docStatus] ?? "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {docStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-500">
                        {formatDate(doc.uploadedAt)}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-500">
                        {formatSize(doc.fileSize)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2 text-neutral-400">
                          <button
                            onClick={() => handleView(doc)}
                            className="rounded p-1 hover:bg-neutral-100 hover:text-neutral-700 transition"
                            title="View"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="rounded p-1 hover:bg-neutral-100 hover:text-neutral-700 transition"
                            title="Download"
                          >
                            <DownloadIcon />
                          </button>
                          {needsSignature && (
                            <button
                              onClick={() => openSignModal(doc)}
                              className="rounded p-1 hover:bg-blue-50 hover:text-blue-600 transition"
                              title="Sign with DocuSign"
                            >
                              <PenIcon />
                            </button>
                          )}
                          {doc.uploadedByClient && (
                            <button
                              onClick={() => setDeleteDoc(doc)}
                              className="rounded p-1 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <TrashIcon />
              </div>
              <h2 className="text-base font-semibold text-neutral-900">Delete Document</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Are you sure you want to delete:</p>
            <p className="text-sm font-medium text-neutral-900 mb-5 truncate">
              {deleteDoc.originalName}
            </p>
            <p className="text-xs text-neutral-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteDoc(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DocuSign Modal */}
      {signDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {!signSent ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <PenIcon />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900">
                      Sign Document
                    </h2>
                    <p className="text-xs text-neutral-500">Confirm your electronic signature</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-1">
                  You are about to sign:
                </p>
                <p className="text-sm font-medium text-neutral-900 mb-4 truncate">
                  {signDoc.title || signDoc.originalName}
                </p>
                <p className="text-sm text-neutral-500 mb-4">
                  By clicking &ldquo;Confirm Signature&rdquo; you agree that this constitutes
                  your electronic signature on this document.
                </p>
                {signError && (
                  <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {signError}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={closeSignModal}
                    className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendForSignature}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                  >
                    Confirm Signature
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-4">
                    <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold text-neutral-900 mb-2">
                    Document Signed
                  </h2>
                  <p className="text-sm text-neutral-500 mb-6">
                    <span className="font-medium text-neutral-700">{signDoc.title || signDoc.originalName}</span>{" "}
                    has been signed successfully. The status has been updated to{" "}
                    <span className="font-medium text-emerald-600">Signed</span>.
                  </p>
                  <button
                    onClick={closeSignModal}
                    className="rounded-lg bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
