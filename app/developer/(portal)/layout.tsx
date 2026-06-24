import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DeveloperNavbar from "../components/DeveloperNavbar";

export default async function DeveloperPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const role = session?.user?.role;
  const userType = (session?.user as { userType?: string } | undefined)?.userType;
  const isAdmin = role === "admin";
  const isDeveloper = role === "client" && userType === "developer";

  if (!session || (!isAdmin && !isDeveloper)) {
    if (!session) {
      const headersList = await headers();
      const pathname = headersList.get("x-pathname") ?? "";
      redirect(`/login${pathname ? `?callbackUrl=${encodeURIComponent(pathname)}` : ""}`);
    }
    redirect("/developer");
  }

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
