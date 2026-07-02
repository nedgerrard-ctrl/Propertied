import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { IAssignedDocument } from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  await connectDB();

  const users = await User.find(
    { role: "client" },
    "_id name firstName lastName email clientType assignedDocuments"
  ).lean();

  const documents = users.flatMap((user) =>
    (user.assignedDocuments ?? [] as IAssignedDocument[]).map((doc: IAssignedDocument) => ({
      ...doc,
      uploadedAt: doc.uploadedAt ? doc.uploadedAt.toISOString() : undefined,
      userId: (user._id as { toString(): string }).toString(),
      userName:
        user.name ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        user.email,
      userEmail: user.email,
      clientType: user.clientType ?? "",
    }))
  );

  documents.sort((a, b) => {
    const aTime = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
    const bTime = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
    return bTime - aTime;
  });

  return NextResponse.json({ documents });
}
