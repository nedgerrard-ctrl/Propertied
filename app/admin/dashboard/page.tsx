import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import EnquiriesPanel from "./enquiries-panel";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              PPM Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
              Enquiries
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Review and manage submitted enquiries.
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Enquiries */}
        <EnquiriesPanel />
      </div>
    </main>
  );
}
