import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import AdminTabs from "./admin-tabs";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-neutral-100">

      {/* ── Brand header bar ──────────────────────────────────────────────── */}
      <div className="bg-[#0f0c0a] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          {/* Left: PPM branding */}
          <div className="flex items-center gap-3">
            <span className="block h-7 w-px bg-[#c8a96e]" />
            <div>
              <span className="block text-[12px] font-bold uppercase tracking-[0.22em] leading-none text-white">
                PPM
              </span>
              <span className="mt-1 block text-[8.5px] uppercase tracking-[0.14em] leading-none text-[#c8a96e]/70">
                Admin Dashboard
              </span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 transition hover:text-white/80"
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7.5 1.5 2 6l5.5 4.5M2 6h9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

{/* ── CardNav + tab panels ──────────────────────────────────────────── */}
      <AdminTabs />

    </main>
  );
}
