import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ClientNavbar from "./components/ClientNavbar";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const isAdmin = session?.user?.role === "admin";
  const isClient = session?.user?.role === "client";

  if (!session || (!isAdmin && !isClient)) {
    redirect("/login");
  }

  return (
    <>
      {isAdmin && (
        <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-neutral-700 bg-neutral-900 px-6 py-3">
          <Link
            href="/admin/dashboard"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-white"
          >
            ← Admin Dashboard
          </Link>
          <span className="text-neutral-600">·</span>
          <span className="text-[11px] font-medium text-neutral-500">
            Previewing Client Portal
          </span>
        </div>
      )}
      <div className="flex min-h-screen bg-white">
        {!isAdmin && <ClientNavbar />}
        {children}
      </div>
    </>
  );
}
