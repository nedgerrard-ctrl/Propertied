import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ClientNavbar from "../components/ClientNavbar";
import DocumentsClient from "./DocumentsClient";

export default async function DocumentsPage() {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <ClientNavbar />
      <DocumentsClient />
    </div>
  );
}
