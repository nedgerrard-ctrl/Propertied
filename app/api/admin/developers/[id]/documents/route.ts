import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ message: "Expected multipart/form-data" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("document");
  const title = (formData.get("title") as string | null ?? "").trim().slice(0, 200);
  const docTypeRaw = formData.get("docType") as string | null;
  const docType = ["Legal", "Ownership", "Financial"].includes(docTypeRaw ?? "") ? docTypeRaw! : "Legal";
  const requiresSignature = formData.get("requiresSignature") === "true";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ message: "File must be 10 MB or smaller" }, { status: 400 });
  }

  await connectDB();

  const developer = await User.findOne({ _id: id, role: "client", userType: "developer" });
  if (!developer) {
    return NextResponse.json({ message: "Developer not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const b64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${b64}`;

  const isRaw =
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
  const uniqueId = Math.random().toString(36).slice(2, 10);
  const publicId = isRaw && ext ? `${uniqueId}.${ext}` : undefined;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `ppm/developer-documents/${id}`,
    resource_type: isRaw ? "raw" : "image",
    ...(publicId ? { public_id: publicId } : { use_filename: true, unique_filename: true }),
  });

  const doc = {
    originalName: file.name,
    storedName: result.public_id,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: result.secure_url,
    title,
    docType,
    docStatus: "Pending",
    requiresSignature,
    uploadedAt: new Date(),
  };

  developer.assignedDocuments = [...(developer.assignedDocuments ?? []), doc];
  await developer.save();

  return NextResponse.json({ success: true, document: doc }, { status: 201 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const storedName = typeof body?.storedName === "string" ? body.storedName : "";
  const docStatus = typeof body?.docStatus === "string" ? body.docStatus : "";

  if (!storedName || !["Approved", "Rejected", "Pending", "Signed", "Draft"].includes(docStatus)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  await connectDB();

  const developer = await User.findOne({ _id: id, role: "client", userType: "developer" });
  if (!developer) {
    return NextResponse.json({ message: "Developer not found" }, { status: 404 });
  }

  const doc = (developer.assignedDocuments ?? []).find(
    (d: { storedName: string }) => d.storedName === storedName
  );
  if (!doc) {
    return NextResponse.json({ message: "Document not found" }, { status: 404 });
  }

  doc.docStatus = docStatus;
  await developer.save();

  return NextResponse.json({ success: true, docStatus });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const storedName = typeof body?.storedName === "string" ? body.storedName : "";

  if (!storedName) {
    return NextResponse.json({ message: "storedName is required" }, { status: 400 });
  }

  await connectDB();

  const developer = await User.findOne({ _id: id, role: "client", userType: "developer" });
  if (!developer) {
    return NextResponse.json({ message: "Developer not found" }, { status: 404 });
  }

  const doc = developer.assignedDocuments?.find(
    (d: { storedName: string }) => d.storedName === storedName
  );

  if (doc) {
    const isRaw =
      doc.fileType === "application/pdf" ||
      doc.fileType === "application/msword" ||
      doc.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    await cloudinary.uploader.destroy(storedName, { resource_type: isRaw ? "raw" : "image" }).catch(() => {});
  }

  developer.assignedDocuments = (developer.assignedDocuments ?? []).filter(
    (d: { storedName: string }) => d.storedName !== storedName
  );
  await developer.save();

  return NextResponse.json({ success: true });
}
