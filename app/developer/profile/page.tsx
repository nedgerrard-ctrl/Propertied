import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DeveloperNavbar from "../components/DeveloperNavbar";
import ProfileClient from "./ProfileClient";

export default async function DeveloperProfilePage() {
  const session = await auth();

  if (!session || session.user?.role !== "developer") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DeveloperNavbar />
      <ProfileClient />
    </div>
  );
}
