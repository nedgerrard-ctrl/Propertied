import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DeveloperNavbar from "../components/DeveloperNavbar";

export default async function DeveloperDashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "developer") {
    redirect("/login");
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex min-h-screen bg-white">
      <DeveloperNavbar />
      <main className="flex-1 px-8 py-8">
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Welcome back, {firstName}.</p>
      </main>
    </div>
  );
}
