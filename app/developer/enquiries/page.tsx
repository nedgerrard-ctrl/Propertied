import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DeveloperNavbar from "../components/DeveloperNavbar";
import EnquiriesClient from "./EnquiriesClient";

export default async function DeveloperEnquiriesPage() {
  const session = await auth();

  if (!session || session.user?.role !== "developer") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DeveloperNavbar />
      <EnquiriesClient />
    </div>
  );
}
