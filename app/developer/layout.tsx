import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeveloperNavbar from "./components/DeveloperNavbar";

export default async function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const isAdmin = session?.user?.role === "admin";
  const isDeveloper = session?.user?.role === "developer";

  if (!session || (!isAdmin && !isDeveloper)) {
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
            Previewing Developer Portal
          </span>
        </div>
      )}
      <div className="flex min-h-screen bg-white">
        {!isAdmin && <DeveloperNavbar />}
        {children}
      </div>
    </>
  );
}
