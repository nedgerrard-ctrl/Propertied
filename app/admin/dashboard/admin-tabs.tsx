"use client";

import { useState } from "react";
import StatsPanel from "./stats-panel";
import EnquiriesPanel from "./enquiries-panel";
import ClientsPanel from "./clients-panel";
import DevelopersPanel from "./developers-panel";

type Tab = "overview" | "enquiries" | "clients" | "developers";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "enquiries", label: "Enquiries" },
  { id: "clients", label: "Clients" },
  { id: "developers", label: "Developers" },
];

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="mt-8">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "rounded px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition",
              activeTab === tab.id
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-800",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === "overview" && <StatsPanel />}
      {activeTab === "enquiries" && <EnquiriesPanel />}
      {activeTab === "clients" && <ClientsPanel />}
      {activeTab === "developers" && <DevelopersPanel />}
    </div>
  );
}
