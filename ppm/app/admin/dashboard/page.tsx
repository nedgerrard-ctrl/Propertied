import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          PPM Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-2 text-neutral-600">
          Protected internal admin area.
        </p>
      </div>
    </main>
  );
}