"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Enquiry = {
  _id: string;
  enquiryType: "general" | "developer" | "buyer";
  status: "pending" | "qualified" | "in-progress" | "closed";
  projectName: string;
  propertyInterest: string;
  preferredLocations: string;
  message: string;
  createdAt: string;
};

type Document = {
  storedName: string;
  docStatus?: string;
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

const TYPE_LABEL: Record<string, string> = {
  general: "General",
  developer: "Developer",
  buyer: "Buyer / Investor",
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

export default function DashboardClient({ firstName }: { firstName: string }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/client/enquiries").then((r) => r.json()),
      fetch("/api/client/documents").then((r) => r.json()),
    ])
      .then(([eData, dData]) => {
        setEnquiries(eData.enquiries ?? []);
        setDocuments(dData.documents ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    totalEnquiries: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    active: enquiries.filter((e) => ["in-progress", "qualified"].includes(e.status)).length,
    totalDocuments: documents.length,
    pendingDocs: documents.filter((d) => (d.docStatus ?? "Pending") === "Pending").length,
  };

  const recent = enquiries.slice(0, 5);

  return (
    <main className="flex-1 px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Welcome back, {firstName}.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Enquiries", value: stats.totalEnquiries, color: "text-neutral-900", href: "/client/enquiries" },
          { label: "Pending", value: stats.pending, color: "text-amber-700", href: "/client/enquiries" },
          { label: "Active", value: stats.active, color: "text-blue-700", href: "/client/enquiries" },
          { label: "Documents", value: stats.totalDocuments, color: "text-neutral-900", href: "/client/documents" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-neutral-200 bg-white px-5 py-4 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              {s.label}
            </p>
            <p className={`mt-1 text-3xl font-semibold ${s.color}`}>
              {loading ? <span className="text-neutral-300">—</span> : s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          New Enquiry
        </Link>
        <Link
          href="/client/documents"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          My Documents
          {stats.pendingDocs > 0 && !loading && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700">
              {stats.pendingDocs}
            </span>
          )}
        </Link>
        <Link
          href="/client/profile"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          My Profile
        </Link>
      </div>

      {/* Recent enquiries */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Enquiries</h2>
          <Link href="/client/enquiries" className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-400">
            Loading…
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center">
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
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recent.map((e) => (
                  <tr key={e._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-neutral-900">
                      {TYPE_LABEL[e.enquiryType] ?? e.enquiryType}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 max-w-xs truncate">
                      {enquiryDetail(e)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[e.status] ?? "bg-neutral-100 text-neutral-500"}`}>
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
