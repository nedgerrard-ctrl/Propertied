"use client";

import { useState, useMemo } from "react";

export type DocumentType = "Legal" | "Ownership" | "Financial";
export type DocumentStatus = "Signed" | "Pending" | "Draft";

export interface ClientDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  date: string;
  size: string;
  needsSignature: boolean;
}

const TYPE_STYLES: Record<DocumentType, string> = {
  Legal: "bg-purple-50 text-purple-700",
  Ownership: "bg-blue-50 text-blue-700",
  Financial: "bg-emerald-50 text-emerald-700",
};

const STATUS_STYLES: Record<DocumentStatus, string> = {
  Signed: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Draft: "bg-neutral-100 text-neutral-500",
};

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

function LinkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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

interface Props {
  documents?: ClientDocument[];
}

export default function DocumentsClient({ documents = [] }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All Types" || doc.type === typeFilter;
      const matchStatus = statusFilter === "All Status" || doc.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [documents, search, typeFilter, statusFilter]);

  return (
    <main className="flex flex-1 flex-col min-h-screen bg-white">
      {/* Top header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
        <h1 className="text-xl font-semibold text-neutral-900">My Documents</h1>
        <div className="flex items-center gap-3 text-neutral-400">
          {/* Bell */}
          <button className="rounded-full p-1.5 hover:bg-neutral-100 transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          {/* User */}
          <button className="rounded-full p-1.5 hover:bg-neutral-100 transition">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 space-y-5">
        {/* Subtitle */}
        <p className="text-sm text-neutral-500">
          Upload, view, and sign your property documents securely.
        </p>

        {/* Upload area */}
        <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-white px-6 py-10 text-center">
          <div className="flex justify-center mb-3">
            <UploadIcon />
          </div>
          <p className="font-semibold text-neutral-900">Upload Documents</p>
          <p className="mt-1 text-sm text-neutral-400">
            Drag and drop your files here, or click to browse
          </p>
          <button className="mt-4 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
            Choose Files
          </button>
          <p className="mt-3 text-xs text-neutral-400">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>

        {/* Search & filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-400 focus:ring-0"
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
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileIcon />
                      <span className="font-medium text-neutral-800">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[doc.type] ?? "bg-neutral-100 text-neutral-600"}`}>
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[doc.status]}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-500">{doc.date}</td>
                  <td className="px-4 py-3.5 text-neutral-500">{doc.size}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2 text-neutral-400">
                      <button className="rounded p-1 hover:bg-neutral-100 hover:text-neutral-700 transition" title="View">
                        <EyeIcon />
                      </button>
                      <button className="rounded p-1 hover:bg-neutral-100 hover:text-neutral-700 transition" title="Download">
                        <DownloadIcon />
                      </button>
                      {doc.needsSignature && (
                        <button className="rounded p-1 hover:bg-neutral-100 hover:text-neutral-700 transition" title="Sign">
                          <LinkIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-400">
                    {documents.length === 0 ? "No documents uploaded yet." : "No documents match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
