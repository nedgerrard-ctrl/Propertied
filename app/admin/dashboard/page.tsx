import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import AdminTabs from "./admin-tabs";
import EditPagesButton from "./EditPagesButton";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              PPM Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
              Dashboard
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Review enquiries and manage content templates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard/pages/new"
              className="inline-flex border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17]"
            >
              Add Guide Page
            </Link>
            <Link
              href="/admin/dashboard/cms-pages"
              className="border border-[#5f5245] px-4 py-2 text-sm"
            >
              Manage Pages
            </Link>
            <Link
              href="/admin/dashboard/blogs"
              className="border border-[#5f5245] px-4 py-2 text-sm"
            >
              Manage Blogs
            </Link>
                        <EditPagesButton />
            <LogoutButton />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard/pages/new"
              className="inline-flex border border-[#5f5245] bg-[#2f2a24] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f1a17]"
            >
              Add Guide Page
            </Link>
            <Link
              href="/admin/dashboard/cms-pages"
              className="border border-[#5f5245] px-4 py-2 text-sm"
            >
              Manage Pages
            </Link>
            <Link
              href="/admin/dashboard/blogs"
              className="border border-[#5f5245] px-4 py-2 text-sm"
            >
              Manage Blogs
            </Link>
                        <EditPagesButton />
            <LogoutButton />
          </div>
        </div>
        </div>
        <AdminTabs />
  
    </main>
  )
};