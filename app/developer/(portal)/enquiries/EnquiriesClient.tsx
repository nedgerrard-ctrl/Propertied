"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Enquiry = {
  _id: string;
  enquiryType: "general" | "developer" | "buyer";
  status: "pending" | "qualified" | "in-progress" | "closed";
  propertyInterest: string;
  projectName: string;
  buyerType: string;
  preferredLocations: string;
  minBudget: string;
  maxBudget: string;
  message: string;
  createdAt: string;
};

const TYPE_LABEL: Record<string, string> = {
  general: "General",
  developer: "Developer",
  buyer: "Buyer",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  qualified: "bg-emerald-50 text-emerald-700",
  "in-progress": "bg-blue-50 text-blue-700",
  closed: "bg-neutral-100 text-neutral-500",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  qualified: "Qualified",
  "in-progress": "In Progress",
  closed: "Closed",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function enquiryDetail(e: Enquiry): string {
  if (e.enquiryType === "developer" && e.projectName) return e.projectName;
  if (e.enquiryType === "buyer") {
    const parts: string[] = [];
    if (e.propertyInterest === "off-plan") parts.push("Off-the-Plan");
    else if (e.propertyInterest === "established") parts.push("Established");
    if (e.preferredLocations) parts.push(e.preferredLocations);
    return parts.join(" · ") || "Buyer enquiry";
  }
  return e.message?.slice(0, 60) || "General enquiry";
}

export default function EnquiriesClient() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/developer/enquiries")
      .then((r) => r.json())
      .then((data) => setEnquiries(data.enquiries ?? []))
      .catch(() => setError("Failed to load enquiries."))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    active: enquiries.filter((e) => e.status === "in-progress" || e.status === "qualified").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  return (
    <main className="flex flex-1 flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-5">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">My Enquiries</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Track your enquiries and interactions with PPM.
          </p>
        </div>
        <Link
          href="/contact"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          New Enquiry
        </Link>
      </div>

      <div className="flex-1 px-8 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total", value: counts.total, color: "text-neutral-900" },
            { label: "Pending", value: counts.pending, color: "text-amber-700" },
            { label: "Active", value: counts.active, color: "text-blue-700" },
            { label: "Closed", value: counts.closed, color: "text-neutral-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-neutral-200 bg-white px-5 py-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                {s.label}
              </p>
              <p className={`mt-1 text-3xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-400">Loading…</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <p className="text-sm font-medium text-neutral-900">No enquiries yet</p>
            <p className="mt-1 text-sm text-neutral-500">
              Submit an enquiry through our{" "}
              <Link href="/contact" className="underline hover:text-neutral-900">
                contact page
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {enquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-neutral-900">
                        {TYPE_LABEL[e.enquiryType] ?? e.enquiryType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 max-w-xs truncate">
                      {enquiryDetail(e)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_STYLE[e.status] ?? "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {STATUS_LABEL[e.status] ?? e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                      {formatDate(e.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
