import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ClientNavbar from "../components/ClientNavbar";
import EnquiriesClient from "./EnquiriesClient";

export default async function EnquiriesPage() {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <ClientNavbar />
      <EnquiriesClient />
    </div>
  );
}
