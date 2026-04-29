import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import ClientNavbar from "../components/ClientNavbar";

export default async function VipPage() {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    redirect("/login");
  }

  if (session.user?.userType !== "existing_client") {
    notFound();
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex min-h-screen bg-white">
      <ClientNavbar />
      <main className="flex-1 px-8 py-8">
        <h1 className="text-xl font-semibold text-neutral-900">VIP Content</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Welcome back, {firstName}. Exclusive access for existing PPM clients.
        </p>
      </main>
    </div>
  );
}
