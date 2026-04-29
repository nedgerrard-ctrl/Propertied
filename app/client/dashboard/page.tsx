import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    redirect("/login");
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              PPM Client Portal
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
              Hello, {firstName}
            </h1>
          </div>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
