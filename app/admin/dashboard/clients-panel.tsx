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
};

type ClientType = "buyer" | "investor" | "developer" | "";

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
  buyer: "Buyer",
  investor: "Investor",
  developer: "Developer",
  "": "—",
};

const ACCOUNT_STATUS_BUTTON: Record<AccountStatus, string> = {
  active: "border-emerald-400 bg-emerald-50 text-emerald-800",
  "pending-existing-client": "border-amber-400 bg-amber-50 text-amber-800",
  "approved-existing-client": "border-blue-400 bg-blue-50 text-blue-800",
  rejected: "border-red-400 bg-red-50 text-red-700",
};

// ─── Utilities ─────────────────────────────────────────────────────────────────

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
    return "Buyer / Investor";
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

  const [notes, setNotes] = useState(initialClient.adminNotes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
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
    }
    setActionLoading(null);
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("document", file);

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
    } else {
      const data = await res.json();
      setUploadError(data.message ?? "Upload failed.");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
                  <div className="flex gap-3">
                    <dt className="w-32 shrink-0 text-neutral-400">Type</dt>
                    <dd className="font-medium text-neutral-900">
                      {CLIENT_TYPE_LABEL[client.clientType] ?? "—"}
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

                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-neutral-200 bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-current shrink-0"
                    >
                      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    {uploading ? "Uploading…" : "Assign Document"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="sr-only"
                      disabled={uploading}
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="mt-1.5 text-[11px] text-neutral-400">
                    PDF, DOC, DOCX, JPG, PNG · max 10 MB
                  </p>
                  {uploadError && (
                    <p className="mt-1 text-[12px] text-red-600">{uploadError}</p>
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

// ─── Main panel ────────────────────────────────────────────────────────────────

export default function ClientsPanel() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((data) => setClients(data.clients ?? []))
      .catch(() => setError("Failed to load clients."))
      .finally(() => setLoading(false));
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (statusFilter !== "all" && getAccountStatus(c) !== statusFilter)
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
  }, [clients, statusFilter, search]);

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
    }),
    [clients]
  );

  const hasFilters = search.trim() !== "" || statusFilter !== "all";

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: counts.total, color: "text-neutral-900" },
          { label: "Buyer", value: counts.active, color: "text-emerald-700" },
          { label: "Pending Approval", value: counts.pending, color: "text-amber-700" },
          { label: "Approved Existing", value: counts.approved, color: "text-blue-700" },
          { label: "Rejected", value: counts.rejected, color: "text-red-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-4"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              {s.label}
            </p>
            <p className={`mt-1 text-3xl font-semibold ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
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

        {/* Status filter */}
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

        {hasFilters && (
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

        <span className="ml-auto self-end text-[12px] text-neutral-400">
          {filtered.length} of {clients.length} clients
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            {clients.length === 0
              ? "No registered clients yet."
              : "No clients match the current filters."}
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
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
              {filtered.map((c, i) => (
                <tr
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                  }`}
                >
                  <td className="px-5 py-3.5 font-medium text-neutral-900">
                    {c.name || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{c.email}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-neutral-600">
                    {c.phone || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">
                    {CLIENT_TYPE_LABEL[c.clientType] ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <AccountStatusBadge status={getAccountStatus(c)} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-neutral-500">
                    {formatDate(c.createdAt)}
                  </td>
                  <td
                    className="px-5 py-3.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelected(c)}
                      className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
