"use client";

import { useEffect, useMemo, useState } from "react";

type EnquiryStatus = "qualified" | "in-progress" | "closed";
type EnquiryType = "general" | "developer" | "buyer";
type PropertyInterest = "off-plan" | "established" | "";

type Enquiry = {
  _id: string;
  enquiryType: EnquiryType;

  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  message: string;

  // buyer / investor fields
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

  // developer fields
  projectName: string;
  projectLocation: string;
  commissionStructureInterest: string;

  status: EnquiryStatus;
  createdAt: string;
};

const STATUS_OPTIONS: EnquiryStatus[] = ["qualified", "in-progress", "closed"];

const STATUS_LABEL: Record<EnquiryStatus, string> = {
  qualified: "Qualified",
  "in-progress": "In Progress",
  closed: "Closed",
};

const STATUS_BADGE: Record<EnquiryStatus, string> = {
  qualified: "bg-emerald-100 text-emerald-800",
  "in-progress": "bg-blue-100 text-blue-800",
  closed: "bg-neutral-200 text-neutral-600",
};

const STATUS_BUTTON: Record<EnquiryStatus, string> = {
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

function getSourceLabel(enquiry: Enquiry) {
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
      setTimeout(() => setSaved(false), 2000);
    }

    setSaving(false);
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
                <dt className="w-28 shrink-0 text-neutral-400">Type</dt>
                <dd className="font-medium text-neutral-900">
                  {getEnquiryTypeLabel(enquiry.enquiryType)}
                </dd>
              </div>

              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-neutral-400">Source</dt>
                <dd className="font-medium text-neutral-900">
                  {getSourceLabel(enquiry)}
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
              Update Status
            </p>

            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPendingStatus(s)}
                  className={`flex-1 rounded border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                    pendingStatus === s
                      ? STATUS_BUTTON[s]
                      : "border-neutral-200 bg-white text-neutral-400"
                  }`}
                >
                  {STATUS_LABEL[s]}
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

export default function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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
    setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
    setSelected((prev) => (prev?._id === id ? { ...prev, status } : prev));
  }

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (typeFilter !== "all" && e.enquiryType !== typeFilter) return false;

      if (sourceFilter !== "all") {
        if (sourceFilter === "off-plan" && e.propertyInterest !== "off-plan") return false;
        if (sourceFilter === "established" && e.propertyInterest !== "established") return false;
        if (sourceFilter === "developer" && e.enquiryType !== "developer") return false;
        if (sourceFilter === "general" && e.enquiryType !== "general") return false;
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
  }, [enquiries, statusFilter, typeFilter, sourceFilter, dateFrom, dateTo]);

  const counts = useMemo(
    () => ({
      total: enquiries.length,
      qualified: enquiries.filter((e) => e.status === "qualified").length,
      "in-progress": enquiries.filter((e) => e.status === "in-progress").length,
      closed: enquiries.filter((e) => e.status === "closed").length,
    }),
    [enquiries]
  );

  const hasFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sourceFilter !== "all" ||
    dateFrom ||
    dateTo;

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total, color: "text-neutral-900" },
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
            <option value="qualified">Qualified</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
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
            <option value="all">All enquiry types</option>
            <option value="general">General</option>
            <option value="buyer">Buyer / Investor</option>
            <option value="developer">Developer</option>
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
              setTypeFilter("all");
              setSourceFilter("all");
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
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Summary</th>
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
                  <td className="px-5 py-3.5 font-medium text-neutral-900">{e.name}</td>
                  <td className="px-5 py-3.5 text-neutral-600">
                    {getEnquiryTypeLabel(e.enquiryType)}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{e.email}</td>
                  <td className="px-5 py-3.5 text-neutral-600">
                    {formatPhone(e.phoneCountryCode, e.phone)}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{getSourceLabel(e)}</td>
                  <td className="px-5 py-3.5 capitalize text-neutral-600">
                    {getSummaryLabel(e)}
                  </td>
                  <td className="px-5 py-3.5">
                    <InlineStatusSelect enquiry={e} onStatusUpdate={handleStatusUpdate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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