"use client";

import { useState, useMemo } from "react";
import CardNav, { CardNavItem } from "@/app/components/CardNav";
import StatsPanel from "./stats-panel";
import EnquiriesPanel from "./enquiries-panel";
import ClientsPanel from "./clients-panel";
import DevelopersPanel from "./developers-panel";
import DocumentsPanel from "./documents-panel";
type Tab = "overview" | "enquiries" | "clients" | "developers" | "documents";

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const navItems = useMemo<CardNavItem[]>(() => [
    {
      label: "Overview",
      bgColor: "#171717",
      textColor: "#ffffff",
      links: [
        {
          label: "Dashboard Stats",
          href: "#",
          ariaLabel: "Go to overview",
          onClick: () => setActiveTab("overview"),
        },
      ],
    },
    {
      label: "Enquiries",
      bgColor: "#92400e",
      textColor: "#ffffff",
      links: [
        {
          label: "All Enquiries",
          href: "#",
          ariaLabel: "View all enquiries",
          onClick: () => setActiveTab("enquiries"),
        },
      ],
    },
    {
      label: "Clients",
      bgColor: "#e5e5e5",
      textColor: "#171717",
      links: [
        {
          label: "Client Accounts",
          href: "#",
          ariaLabel: "Manage client accounts",
          onClick: () => setActiveTab("clients"),
        },
      ],
    },
    {
      label: "Developers",
      bgColor: "#404040",
      textColor: "#ffffff",
      links: [
        {
          label: "Developer Accounts",
          href: "#",
          ariaLabel: "Manage developer accounts",
          onClick: () => setActiveTab("developers"),
        },
      ],
    },
    {
      label: "Documents",
      bgColor: "#1e3a5f",
      textColor: "#ffffff",
      links: [
        {
          label: "All Documents",
          href: "#",
          ariaLabel: "Manage documents",
          onClick: () => setActiveTab("documents"),
        },
      ],
    },
    {
      label: "CMS",
      bgColor: "#3b1f4a",
      textColor: "#ffffff",
      links: [
        {
          label: "Manage Pages",
          href: "/admin/dashboard/pages",
          ariaLabel: "Manage CMS pages",
        },
        {
          label: "Manage Blogs",
          href: "/admin/dashboard/blogs",
          ariaLabel: "Manage blog posts",
        },
        {
          label: "Manage VIP Contents",
          href: "/admin/dashboard/vip",
          ariaLabel: "Manage VIP content posts",
        },
      ],
    },
  ], []);

  return (
    <div className="mt-8">
      <CardNav
        logoText="PPM"
        logoAlt="PPM"
        items={navItems}
        containerClassName="relative w-full"
        baseColor="#ffffff"
        menuColor="#171717"
        alwaysOpen
      />

      <div className="mt-4">
        {activeTab === "overview" && <StatsPanel />}
        {activeTab === "enquiries" && <EnquiriesPanel />}
        {activeTab === "clients" && <ClientsPanel />}
        {activeTab === "developers" && <DevelopersPanel />}
        {activeTab === "documents" && <DocumentsPanel />}
      </div>
    </div>
  );
}
