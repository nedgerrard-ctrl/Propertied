"use client";

import { useEffect, useState, useMemo } from "react";

type EnquiryStatus = "new" | "contacted" | "closed";

type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest: "off-plan" | "established";
  investorType: "local" | "overseas";
  message: string;
  status: EnquiryStatus;
  createdAt: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────

function statusBadge(status: EnquiryStatus) {
  const styles: Record<EnquiryStatus, string> = {
    new: "bg-amber-100 text-amber-800",
    contacted: "bg-blue-100 text-blue-800",
    closed: "bg-neutral-200 text-neutral-600",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${styles[status]}`}
    >
      {status}
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

// ── Detail slide-over ───────────────────────────────────────────────────────

function DetailPanel({
  enquiry,
  onClose,
  onStatusUpdate,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatusUpdate: (id: string, status: EnquiryStatus) => void;
}) {
  const [pendingStatus, setPendingStatus] = useState<EnquiryStatus>(
    enquiry.status
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (pendingStatus === enquiry.status) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus }),
      });
      if (res.ok) {
        onStatusUpdate(enquiry._id, pendingStatus);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  const statusOptions: EnquiryStatus[] = ["new", "contacted", "closed"];
  const optionStyles: Record<EnquiryStatus, string> = {
    new: "border-amber-400 bg-amber-50 text-amber-800",
    contacted: "border-blue-400 bg-blue-50 text-blue-800",
    closed: "border-neutral-400 bg-neutral-100 text-neutral-600",
  };
  const optionIdle = "border-neutral-200 bg-white text-neutral-500";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-30 bg-black/20"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
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

        {/* Body */}
        <div className="flex flex-1 flex-col gap-6 px-6 py-6">
          {/* Contact info */}
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Contact
            </p>
            <dl className="space-y-2 text-[13px]">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-neutral-400">Email</dt>
                <dd className="font-medium text-neutral-900 break-all">
                  <a href={`mailto:${enquiry.email}`} className="hover:underline">
                    {enquiry.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-neutral-400">Phone</dt>
                <dd className="font-medium text-neutral-900">
                  <a href={`tel:${enquiry.phone}`} className="hover:underline">
                    {enquiry.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-neutral-400">Submitted</dt>
                <dd className="font-medium text-neutral-900">
                  {formatDate(enquiry.createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          <hr className="border-neutral-100" />

          {/* Enquiry info */}
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Enquiry Details
            </p>
            <dl className="space-y-2 text-[13px]">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-neutral-400">Source</dt>
                <dd className="font-medium capitalize text-neutral-900">
                  {enquiry.propertyInterest === "off-plan"
                    ? "Off-the-Plan"
                    : "Established"}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-neutral-400">Investor</dt>
                <dd className="font-medium capitalize text-neutral-900">
                  {enquiry.investorType}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-neutral-400">Status</dt>
                <dd>{statusBadge(enquiry.status)}</dd>
              </div>
            </dl>
          </section>

          {enquiry.message && (
            <>
              <hr className="border-neutral-100" />
              <section>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Message
                </p>
                <p className="text-[13px] leading-6 text-neutral-700 whitespace-pre-wrap">
                  {enquiry.message}
                </p>
              </section>
            </>
          )}

          <hr className="border-neutral-100" />

          {/* Status update */}
          <section>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Update Status
            </p>
            <div className="flex gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPendingStatus(s)}
                  className={`flex-1 rounded border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                    pendingStatus === s ? optionStyles[s] : optionIdle
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={saving || pendingStatus === enquiry.status}
              className="mt-3 w-full rounded border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700 disabled:opacity-40"
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Status"}
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}

// ── Main panel ──────────────────────────────────────────────────────────────

export default function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((data) => setEnquiries(data.enquiries ?? []))
      .catch(() => setError("Failed to load enquiries."))
      .finally(() => setLoading(false));
  }, []);

  function handleStatusUpdate(id: string, status: EnquiryStatus) {
    setEnquiries((prev) =>
      prev.map((e) => (e._id === id ? { ...e, status } : e))
    );
    setSelected((prev) => (prev?._id === id ? { ...prev, status } : prev));
  }

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (sourceFilter !== "all" && e.propertyInterest !== sourceFilter)
        return false;
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
  }, [enquiries, statusFilter, sourceFilter, dateFrom, dateTo]);

  // Stats
  const counts = useMemo(
    () => ({
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === "new").length,
      contacted: enquiries.filter((e) => e.status === "contacted").length,
      closed: enquiries.filter((e) => e.status === "closed").length,
    }),
    [enquiries]
  );

  const hasFilters =
    statusFilter !== "all" || sourceFilter !== "all" || dateFrom || dateTo;

  function clearFilters() {
    setStatusFilter("all");
    setSourceFilter("all");
    setDateFrom("");
    setDateTo("");
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
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total, color: "text-neutral-900" },
          { label: "New", value: counts.new, color: "text-amber-700" },
          { label: "Contacted", value: counts.contacted, color: "text-blue-700" },
          { label: "Closed", value: counts.closed, color: "text-neutral-400" },
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

      {/* Filter bar */}
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded border border-neutral-200 px-3 py-1.5 text-[13px] text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="all">All sources</option>
            <option value="off-plan">Off-the-Plan</option>
            <option value="established">Established</option>
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
            onClick={clearFilters}
            className="self-end rounded border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto self-end text-[12px] text-neutral-400">
          {filtered.length} of {enquiries.length} enquiries
        </span>
      </div>

      {/* Table */}
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
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Investor</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr
                  key={e._id}
                  onClick={() => setSelected(e)}
                  className={`cursor-pointer border-b border-neutral-100 transition last:border-0 hover:bg-neutral-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                  }`}
                >
                  <td className="whitespace-nowrap px-5 py-3.5 text-neutral-500">
                    {formatDate(e.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-neutral-900">
                    {e.name}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{e.email}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{e.phone}</td>
                  <td className="px-5 py-3.5 capitalize text-neutral-600">
                    {e.propertyInterest === "off-plan"
                      ? "Off-the-Plan"
                      : "Established"}
                  </td>
                  <td className="px-5 py-3.5 capitalize text-neutral-600">
                    {e.investorType}
                  </td>
                  <td className="px-5 py-3.5">{statusBadge(e.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail slide-over */}
      {selected && (
        <DetailPanel
          enquiry={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
