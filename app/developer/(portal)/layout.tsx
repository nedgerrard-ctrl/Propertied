import { auth } from "@/auth";
import Link from "next/link";
import DeveloperNavbar from "../components/DeveloperNavbar";

export default async function DeveloperPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-white">
      <DeveloperNavbar />
      <div className="flex flex-1 flex-col">
        {isAdmin && (
          <div className="flex items-center gap-3 border-b border-neutral-700 bg-neutral-900 px-6 py-3">
            <Link
              href="/admin/dashboard"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-white"
            >
              ← Admin Dashboard
            </Link>
            <span className="text-neutral-600">·</span>
            <span className="text-[11px] font-medium text-neutral-500">
              Previewing Developer Portal
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
