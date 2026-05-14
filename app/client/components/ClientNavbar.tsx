"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const BASE_LINKS = [
  { href: "/client/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/client/enquiries", label: "Enquiries", icon: "mail" },
  { href: "/client/documents", label: "Documents", icon: "document" },
  { href: "/client/profile", label: "Profile", icon: "profile" },
  { href: "/", label: "Back to Main Page", icon: "home" },
];

const VIP_LINK = { href: "/client/vip", label: "VIP Content", icon: "star" };

function NavIcon({ name }: { name: string }) {
  const cls = "h-4 w-4 shrink-0";
  switch (name) {
    case "dashboard":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "mail":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </svg>
      );
    case "portfolio":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="17" />
          <line x1="9" y1="14.5" x2="15" y2="14.5" />
        </svg>
      );
    case "document":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "profile":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ClientNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";
  const isApprovedExistingClient = session?.user?.userType === "existing_client" && !session?.user?.pendingApproval;
  const links = (isAdmin || isApprovedExistingClient) ? [...BASE_LINKS, VIP_LINK] : BASE_LINKS;
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-neutral-200 bg-white px-4 py-6">
      {/* Brand */}
      <div className="mb-8 px-2">
        <Link href="/" className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
          PPM Client Portal
        </Link>
        <p className="mt-0.5 text-xs text-neutral-400">Welcome back, {firstName}</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
              ].join(" ")}
            >
              <NavIcon name={link.icon} />
              {link.label}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
