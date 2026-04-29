import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ClientNavbar from "../components/ClientNavbar";

export default async function Section1Page() {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <ClientNavbar />
      <main className="flex-1 px-8 py-8">
        <h1 className="text-xl font-semibold text-neutral-900">Section 1</h1>
        <p className="mt-1 text-sm text-neutral-500">Coming soon.</p>
      </main>
    </div>
  );
}
