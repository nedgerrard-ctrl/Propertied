import { auth } from "@/auth";

export default async function ClientDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <main className="flex-1 px-8 py-8">
      <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Welcome back, {firstName}.</p>
    </main>
  );
}
