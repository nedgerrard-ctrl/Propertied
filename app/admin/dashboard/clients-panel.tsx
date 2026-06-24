"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AccountStatus =
  | "active"
  | "pending-existing-client"
  | "approved-existing-client"
  | "rejected";

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

type ClientType = "investor" | "owner-occupier" | "";

type Client = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: "buyer_investor" | "existing_client";
  clientType: ClientType;
  accountStatus?: AccountStatus;
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
  propertyInterest: string;
  projectName: string;
  buyerType: string;
  investorRegion: string;
  legalDocuments: LegalDocument[];
  createdAt: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getAccountStatus(client: Pick<Client, "userType" | "pendingApproval" | "accountStatus">): AccountStatus {
  if (client.accountStatus === "rejected") return "rejected";
  if (client.accountStatus === "approved-existing-client") return "approved-existing-client";
  if (client.accountStatus === "pending-existing-client") return "pending-existing-client";
  // fallback for pre-migration data
  if (client.pendingApproval) return "pending-existing-client";
  if (client.userType === "existing_client") return "approved-existing-client";
  return "active";
}

function statusToPatch(status: AccountStatus): Record<string, unknown> {
  if (status === "approved-existing-client")
    return { accountStatus: "approved-existing-client", userType: "existing_client", pendingApproval: false };
  if (status === "pending-existing-client")
    return { accountStatus: "pending-existing-client", userType: "existing_client", pendingApproval: true };
  if (status === "rejected")
    return { accountStatus: "rejected", userType: "buyer_investor", pendingApproval: false };
  return { accountStatus: "active", userType: "buyer_investor", pendingApproval: false };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCOUNT_STATUS_OPTIONS: AccountStatus[] = [
  "active",
  "pending-existing-client",
  "approved-existing-client",
  "rejected",
];

const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  active: "Buyer",
  "pending-existing-client": "Pending Approval",
  "approved-existing-client": "Approved Existing",
  rejected: "Rejected",
};

const ACCOUNT_STATUS_BADGE: Record<AccountStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  "pending-existing-client": "bg-amber-100 text-amber-800",
  "approved-existing-client": "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-700",
};

const CLIENT_TYPE_LABEL: Record<ClientType, string> = {
  investor: "Investor",
  "owner-occupier": "Owner-Occupier",
  "": "—",
};

const CLIENT_TYPE_OPTIONS: ClientType[] = ["investor", "owner-occupier", ""];

const ACCOUNT_STATUS_BUTTON: Record<AccountStatus, string> = {
  active: "border-emerald-400 bg-emerald-50 text-emerald-800",
  "pending-existing-client": "border-amber-400 bg-amber-50 text-amber-800",
  "approved-existing-client": "border-blue-400 bg-blue-50 text-blue-800",
  rejected: "border-red-400 bg-red-50 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(fileSize: number) {
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

function getEnquiryLabel(enquiry: Enquiry) {
  if (enquiry.enquiryType === "buyer") {
    if (enquiry.propertyInterest === "off-plan") return "Off-the-Plan";
    if (enquiry.propertyInterest === "established") return "Established";
    return "Buyer";
  }
  if (enquiry.enquiryType === "developer") return "Developer";
  return "General";
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        ACCOUNT_STATUS_BADGE[status] ?? "bg-neutral-100 text-neutral-500"
      }`}
    >
      {ACCOUNT_STATUS_LABEL[status] ?? status}
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
            className="w-full rounded-sm border border-neutral-200 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-sm bg-red-600 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────

function ClientDetailPanel({
  client: initialClient,
  onClose,
  onStatusUpdate,
}: {
  client: Client;
  onClose: () => void;
  onStatusUpdate: (id: string, status: AccountStatus) => void;
}) {
  const [client, setClient] = useState<Client>(initialClient);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState("");

  const [pendingStatus, setPendingStatus] = useState<AccountStatus>(
    getAccountStatus(initialClient)
  );
  const [savingStatus, setSavingStatus] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const [actionError, setActionError] = useState("");

  const [pendingClientType, setPendingClientType] = useState<ClientType>(initialClient.clientType ?? "");
  const [savingClientType, setSavingClientType] = useState(false);
  const [savedClientType, setSavedClientType] = useState(false);

  const [notes, setNotes] = useState(initialClient.adminNotes ?? "");
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
    setLoadingDetail(true);
    setDetailError("");
    fetch(`/api/admin/clients/${initialClient._id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.client) setClient(data.client);
        if (data.enquiries) setEnquiries(data.enquiries);
        setNotes(data.client?.adminNotes ?? "");
        setPendingStatus(
          data.client ? getAccountStatus(data.client) : getAccountStatus(initialClient)
        );
      })
      .catch(() => setDetailError("Failed to load client details."))
      .finally(() => setLoadingDetail(false));
  }, [initialClient._id]);

  async function handleApprovalAction(action: "approve" | "reject") {
    const patch =
      action === "approve"
        ? { accountStatus: "approved-existing-client", userType: "existing_client", pendingApproval: false }
        : { accountStatus: "rejected", userType: "buyer_investor", pendingApproval: false };
    setActionLoading(action);
    setActionError("");
    try {
      const res = await fetch(`/api/admin/clients/${client._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
        const newStatus = getAccountStatus(data.client);
        setPendingStatus(newStatus);
        onStatusUpdate(client._id, newStatus);
      } else {
        const data = await res.json().catch(() => ({}));
        setActionError(data.message ?? "Action failed. Please try again.");
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSaveStatus() {
    if (pendingStatus === getAccountStatus(client)) return;
    setSavingStatus(true);
    const res = await fetch(`/api/admin/clients/${client._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statusToPatch(pendingStatus)),
    });
    if (res.ok) {
      const data = await res.json();
      setClient(data.client);
      onStatusUpdate(client._id, pendingStatus);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    }
    setSavingStatus(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    const res = await fetch(`/api/admin/clients/${client._id}`, {
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

  async function handleSaveClientType() {
    if (pendingClientType === (client.clientType ?? "")) return;
    setSavingClientType(true);
    const res = await fetch(`/api/admin/clients/${client._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientType: pendingClientType }),
    });
    if (res.ok) {
      const data = await res.json();
      setClient(data.client);
      setSavedClientType(true);
      setTimeout(() => setSavedClientType(false), 2000);
    }
    setSavingClientType(false);
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

    const res = await fetch(`/api/admin/clients/${client._id}/documents`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setClient((prev) => ({
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
    const res = await fetch(`/api/admin/clients/${client._id}/documents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storedName: docToDelete.storedName }),
    });
    if (res.ok) {
      setClient((prev) => ({
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
              Client Profile
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-neutral-900">
              {client.name || "Unnamed Client"}
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loadingDetail ? (
            <div className="py-10 text-center text-sm text-neutral-400">
              Loading…
            </div>
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
                      {client.name || "—"}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Email</dt>
                    <dd className="break-all font-medium text-neutral-900">
                      <a
                        href={`mailto:${client.email}`}
                        className="hover:underline"
                      >
                        {client.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Phone</dt>
                    <dd className="font-medium text-neutral-900">
                      {client.phone ? (
                        <a
                          href={`tel:${client.phone.replace(/\s/g, "")}`}
                          className="hover:underline"
                        >
                          {client.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-3 items-center">
                    <dt className="w-32 shrink-0 text-neutral-400">Type</dt>
                    <dd className="flex items-center gap-2">
                      <select
                        value={pendingClientType}
                        onChange={(e) => setPendingClientType(e.target.value as ClientType)}
                        className="rounded border border-neutral-200 bg-white px-2 py-1 text-[13px] text-neutral-800 outline-none focus:border-neutral-400"
                      >
                        {CLIENT_TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {CLIENT_TYPE_LABEL[t]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleSaveClientType}
                        disabled={savingClientType || pendingClientType === (client.clientType ?? "")}
                        className="rounded border border-neutral-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-500 disabled:opacity-50"
                      >
                        {savingClientType ? "Saving…" : savedClientType ? "Saved" : "Save"}
                      </button>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Status</dt>
                    <dd>
                      <AccountStatusBadge status={getAccountStatus(client)} />
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Registered</dt>
                    <dd className="font-medium text-neutral-900">
                      {formatDate(client.createdAt)}
                    </dd>
                  </div>
                </dl>
              </section>

              <hr className="border-neutral-100" />

              {/* Pending existing-client approval actions */}
              {getAccountStatus(client) === "pending-existing-client" && (
                <section>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-amber-600 shrink-0">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
                        Pending Existing Client Approval
                      </p>
                    </div>
                    <p className="text-[13px] text-amber-800 leading-5 mb-4">
                      This user claims to be an existing PPM client. Review their details then approve or reject their request.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleApprovalAction("approve")}
                        disabled={actionLoading !== null}
                        className="rounded border border-emerald-600 bg-emerald-600 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === "approve" ? "Approving…" : "Approve Existing Client"}
                      </button>
                      <button
                        onClick={() => handleApprovalAction("reject")}
                        disabled={actionLoading !== null}
                        className="rounded border border-neutral-300 bg-white px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-500 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === "reject" ? "Rejecting…" : "Reject Existing Client"}
                      </button>
                    </div>
                    {actionError && (
                      <p className="mt-2 text-[12px] text-red-600">{actionError}</p>
                    )}
                  </div>
                </section>
              )}

              <hr className="border-neutral-100" />

              {/* Account status control */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Update Account Status
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ACCOUNT_STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPendingStatus(s)}
                      className={`rounded border px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition leading-tight ${
                        pendingStatus === s
                          ? ACCOUNT_STATUS_BUTTON[s]
                          : "border-neutral-200 bg-white text-neutral-400"
                      }`}
                    >
                      {ACCOUNT_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSaveStatus}
                  disabled={
                    savingStatus || pendingStatus === getAccountStatus(client)
                  }
                  className="mt-3 w-full rounded border border-blue-600 bg-blue-600 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingStatus
                    ? "Saving…"
                    : savedStatus
                      ? "Saved"
                      : "Save Status"}
                </button>
              </section>

              <hr className="border-neutral-100" />

              {/* Submitted enquiries */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Submitted Enquiries ({enquiries.length})
                </p>
                {enquiries.length === 0 ? (
                  <p className="text-[13px] text-neutral-400">
                    No enquiries submitted.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {enquiries.map((eq) => (
                      <div
                        key={eq._id}
                        className="rounded border border-neutral-200 bg-neutral-50 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-medium text-neutral-900">
                            {getEnquiryLabel(eq)}
                          </span>
                          <EnquiryStatusBadge status={eq.status} />
                        </div>
                        <p className="mt-1 text-[12px] text-neutral-500">
                          {formatDate(eq.createdAt)}
                          {eq.legalDocuments?.length > 0 && (
                            <span className="ml-2 text-neutral-400">
                              · {eq.legalDocuments.length}{" "}
                              {eq.legalDocuments.length === 1
                                ? "document"
                                : "documents"}
                            </span>
                          )}
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

              {/* Assigned documents (admin uploads) */}
              <section>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Assigned Documents ({client.assignedDocuments?.length ?? 0})
                </p>

                {(client.assignedDocuments?.length ?? 0) === 0 ? (
                  <p className="mb-3 text-[13px] text-neutral-400">
                    No documents assigned yet.
                  </p>
                ) : (
                  <div className="mb-3 space-y-2">
                    {client.assignedDocuments.map((doc) => (
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
                  placeholder="Add internal notes about this client…"
                  className="w-full resize-y rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    {notes.length}/2000
                  </span>
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
        message={`Remove "${docToDelete?.originalName}" from this client's profile? This cannot be undone.`}
        confirmLabel="Remove"
        loading={deletingDoc}
        onCancel={() => {
          if (!deletingDoc) setDocToDelete(null);
        }}
        onConfirm={handleDeleteDoc}
      />
    </>
  );
}

async function bulkRemoveClients(ids: string[]) {
  const res = await fetch("/api/admin/clients", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to remove selected clients");
  return true;
}

async function removeClient(id: string) {
  const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove client");
  return true;
}

// ─── Main panel ────────────────────────────────────────────────────────────────

export default function ClientsPanel() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRemoving, setBulkRemoving] = useState(false);
  const [showBulkRemoveConfirm, setShowBulkRemoveConfirm] = useState(false);

  // Archived state
  const [archivedClients, setArchivedClients] = useState<Client[]>([]);
  const [archivedLoading, setArchivedLoading] = useState(true);
  const [archivedError, setArchivedError] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [confirmPermanentDelete, setConfirmPermanentDelete] = useState<Client | null>(null);
  const [deletingPermanent, setDeletingPermanent] = useState(false);
  const [showBulkPermanentDeleteConfirm, setShowBulkPermanentDeleteConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkRestoring, setBulkRestoring] = useState(false);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((data) => setClients(data.clients ?? []))
      .catch(() => setError("Failed to load clients."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/admin/clients?archived=true")
      .then((r) => r.json())
      .then((data) => setArchivedClients(data.clients ?? []))
      .catch(() => setArchivedError("Failed to load archived accounts."))
      .finally(() => setArchivedLoading(false));
  }, []);

  function handleStatusUpdate(id: string, status: AccountStatus) {
    const updates: Partial<Client> = {
      accountStatus: status,
      ...(status === "approved-existing-client"
        ? { userType: "existing_client", pendingApproval: false }
        : status === "pending-existing-client"
        ? { userType: "existing_client", pendingApproval: true }
        : { userType: "buyer_investor", pendingApproval: false }),
    };
    setClients((prev) =>
      prev.map((c) => (c._id === id ? { ...c, ...updates } : c))
    );
    setSelected((prev) =>
      prev?._id === id ? ({ ...prev, ...updates } as Client) : prev
    );
  }

  function handleRemove(id: string) {
    setClients((prev) => prev.filter((c) => c._id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    setSelected((prev) => (prev?._id === id ? null : prev));
  }

  async function handleRestore(id: string) {
    setRestoringId(id);
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      if (res.ok) {
        setArchivedClients((prev) => prev.filter((c) => c._id !== id));
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      }
    } finally {
      setRestoringId(null);
    }
  }

  async function handlePermanentDelete() {
    if (!confirmPermanentDelete) return;
    setDeletingPermanent(true);
    try {
      const res = await fetch(`/api/admin/clients/${confirmPermanentDelete._id}?permanent=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArchivedClients((prev) => prev.filter((c) => c._id !== confirmPermanentDelete._id));
        setSelectedIds((prev) => prev.filter((sid) => sid !== confirmPermanentDelete._id));
      }
    } finally {
      setDeletingPermanent(false);
      setConfirmPermanentDelete(null);
    }
  }

  async function handleBulkRestore() {
    setBulkRestoring(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/admin/clients/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ restore: true }),
          })
        )
      );
      setArchivedClients((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
      setSelectedIds([]);
    } catch {
      alert("Failed to restore some accounts.");
    } finally {
      setBulkRestoring(false);
    }
  }

  async function handleBulkPermanentDelete() {
    setBulkDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/admin/clients/${id}?permanent=true`, { method: "DELETE" })
        )
      );
      setArchivedClients((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
      setSelectedIds([]);
      setShowBulkPermanentDeleteConfirm(false);
    } catch {
      alert("Failed to permanently delete some accounts.");
    } finally {
      setBulkDeleting(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const source = showArchived ? archivedClients : clients;
    return source.filter((c) => {
      if (!showArchived && statusFilter !== "all" && getAccountStatus(c) !== statusFilter)
        return false;
      if (q) {
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !(c.phone ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [clients, archivedClients, showArchived, statusFilter, search]);

  const counts = useMemo(
    () => ({
      total: clients.length,
      active: clients.filter((c) => getAccountStatus(c) === "active").length,
      pending: clients.filter(
        (c) => getAccountStatus(c) === "pending-existing-client"
      ).length,
      approved: clients.filter(
        (c) => getAccountStatus(c) === "approved-existing-client"
      ).length,
      rejected: clients.filter((c) => getAccountStatus(c) === "rejected").length,
      archived: archivedClients.length,
    }),
    [clients, archivedClients]
  );

  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  const allFilteredIds = filtered.map((c) => c._id);
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.includes(c._id));
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
      await bulkRemoveClients(selectedIds);
      setClients((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
      setSelected((prev) => (prev && selectedIds.includes(prev._id) ? null : prev));
      setSelectedIds([]);
      setShowBulkRemoveConfirm(false);
    } catch {
      alert("Failed to remove selected clients.");
    } finally {
      setBulkRemoving(false);
    }
  }

  async function handleRowRemove(e: React.MouseEvent, clientId: string, clientName: string) {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Remove client "${clientName}" from the dashboard? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await removeClient(clientId);
      handleRemove(clientId);
    } catch {
      alert("Failed to remove client.");
    }
  }

  if (loading) {
    return (
      <div className="mt-10 text-center text-sm text-neutral-400">
        Loading clients…
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
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
        {[
          { label: "Total", value: counts.total, color: "text-neutral-900" },
          { label: "Buyer", value: counts.active, color: "text-emerald-700" },
          { label: "Pending Approval", value: counts.pending, color: "text-amber-700" },
          { label: "Approved Existing", value: counts.approved, color: "text-blue-700" },
          { label: "Rejected", value: counts.rejected, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">{s.label}</p>
            <p className={`mt-1 text-3xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
        <button
          onClick={() => { setShowArchived((v) => !v); setSearch(""); setSelectedIds([]); }}
          className={[
            "rounded-lg border px-5 py-4 text-left transition",
            showArchived
              ? "border-neutral-800 bg-neutral-900 ring-2 ring-neutral-800"
              : "border-neutral-200 bg-white hover:border-neutral-400",
          ].join(" ")}
        >
          <p className={`text-[10px] font-medium uppercase tracking-[0.18em] ${showArchived ? "text-neutral-400" : "text-neutral-400"}`}>
            Archived
          </p>
          <p className={`mt-1 text-3xl font-semibold ${showArchived ? "text-white" : "text-neutral-500"}`}>
            {archivedLoading ? "—" : counts.archived}
          </p>
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-4">
        {/* Search */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Search
          </label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, or phone…"
            className="w-56 rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>

        {/* Status filter — hidden in archived mode */}
        {!showArchived && (
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
              <option value="active">Buyer</option>
              <option value="pending-existing-client">Pending Approval</option>
              <option value="approved-existing-client">Approved Existing</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}

        <a
          href="/client/dashboard"
          target="_blank"
          rel="noreferrer"
          className="self-end flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
          </svg>
          Client Portal
        </a>

        <button
          onClick={() => {
            setShowArchived((v) => !v);
            setSearch("");
            setSelectedIds([]);
          }}
          className={[
            "self-end flex items-center gap-1.5 rounded border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition",
            showArchived
              ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-700"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900",
          ].join(" ")}
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
            <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
            <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
          </svg>
          Archived Accounts
        </button>

        {!showArchived && hasFilters && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="self-end rounded border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
          >
            Clear filters
          </button>
        )}

        {showArchived && search.trim() && (
          <button
            onClick={() => setSearch("")}
            className="self-end rounded border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
          >
            Clear search
          </button>
        )}

        <span className="ml-auto self-end text-[12px] text-neutral-400">
          {showArchived
            ? `${filtered.length} of ${archivedClients.length} archived`
            : `${filtered.length} of ${clients.length} clients`}
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

        {showArchived ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkRestore}
              disabled={selectedCount === 0 || bulkRestoring}
              className="rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkRestoring
                ? "Restoring…"
                : `Restore Selected${selectedCount ? ` (${selectedCount})` : ""}`}
            </button>
            <button
              onClick={() => setShowBulkPermanentDeleteConfirm(true)}
              disabled={selectedCount === 0 || bulkDeleting}
              className="rounded border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkDeleting
                ? "Deleting…"
                : `Delete Permanently${selectedCount ? ` (${selectedCount})` : ""}`}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowBulkRemoveConfirm(true)}
            disabled={selectedCount === 0 || bulkRemoving}
            className="rounded border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bulkRemoving
              ? "Removing…"
              : `Remove Selected${selectedCount ? ` (${selectedCount})` : ""}`}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        {showArchived && archivedLoading ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">Loading archived accounts…</div>
        ) : showArchived && archivedError ? (
          <div className="px-6 py-8 text-center text-sm text-red-600">{archivedError}</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            {showArchived
              ? archivedClients.length === 0
                ? "No archived accounts."
                : "No archived accounts match the search."
              : clients.length === 0
              ? "No registered clients yet."
              : "No clients match the current filters."}
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
                    aria-label="Select all visible clients"
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                </th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Registered</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isChecked = selectedIds.includes(c._id);
                return (
                  <tr
                    key={c._id}
                    onClick={() => !showArchived && setSelected(c)}
                    className={[
                      "border-b border-neutral-100 transition last:border-0",
                      showArchived ? "opacity-75" : "cursor-pointer hover:bg-neutral-50",
                      i % 2 === 0 ? "bg-white" : "bg-neutral-50/40",
                    ].join(" ")}
                  >
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(c._id)}
                        aria-label={`Select client ${c.name}`}
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                    </td>
                    <td className={`px-5 py-3.5 font-medium ${showArchived ? "text-neutral-400" : "text-neutral-900"}`}>
                      {c.name || "—"}
                    </td>
                    <td className={`px-5 py-3.5 ${showArchived ? "text-neutral-400" : "text-neutral-600"}`}>{c.email}</td>
                    <td className={`whitespace-nowrap px-5 py-3.5 ${showArchived ? "text-neutral-400" : "text-neutral-600"}`}>
                      {c.phone || "—"}
                    </td>
                    <td className={`px-5 py-3.5 ${showArchived ? "text-neutral-400" : "text-neutral-600"}`}>
                      {CLIENT_TYPE_LABEL[c.clientType] ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <AccountStatusBadge status={getAccountStatus(c)} />
                    </td>
                    <td className={`whitespace-nowrap px-5 py-3.5 ${showArchived ? "text-neutral-400" : "text-neutral-500"}`}>
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      {showArchived ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore(c._id)}
                            disabled={restoringId === c._id}
                            className="rounded border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {restoringId === c._id ? "Restoring…" : "Restore"}
                          </button>
                          <button
                            onClick={() => setConfirmPermanentDelete(c)}
                            className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100"
                          >
                            Delete Permanently
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(c)}
                            className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => handleRowRemove(e, c._id, c.name)}
                            className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <ClientDetailPanel
          client={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <ConfirmDialog
        open={showBulkRemoveConfirm}
        title="Remove selected clients?"
        message={`Are you sure you want to remove ${selectedCount} selected ${
          selectedCount === 1 ? "client" : "clients"
        } from the dashboard? They will not be deleted from the database.`}
        confirmLabel="Remove"
        loading={bulkRemoving}
        onCancel={() => { if (!bulkRemoving) setShowBulkRemoveConfirm(false); }}
        onConfirm={handleBulkRemove}
      />

      <ConfirmDialog
        open={Boolean(confirmPermanentDelete)}
        title="Permanently delete account?"
        message={`This will permanently remove ${confirmPermanentDelete?.name || "this account"}'s account and all associated data from the database. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        loading={deletingPermanent}
        onCancel={() => { if (!deletingPermanent) setConfirmPermanentDelete(null); }}
        onConfirm={handlePermanentDelete}
      />

      <ConfirmDialog
        open={showBulkPermanentDeleteConfirm}
        title="Permanently delete selected accounts?"
        message={`This will permanently remove ${selectedCount} selected ${
          selectedCount === 1 ? "account" : "accounts"
        } and all associated data from the database. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        loading={bulkDeleting}
        onCancel={() => { if (!bulkDeleting) setShowBulkPermanentDeleteConfirm(false); }}
        onConfirm={handleBulkPermanentDelete}
      />
    </div>
  );
}
