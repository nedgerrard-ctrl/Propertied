import { auth } from "@/auth";
import DashboardClient from "./DashboardClient";

export default async function ClientDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return <DashboardClient firstName={firstName} />;
}
