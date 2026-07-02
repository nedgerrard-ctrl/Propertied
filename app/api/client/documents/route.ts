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

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email?.toLowerCase(),
  }).lean();

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ documents: user.assignedDocuments ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("document");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Unsupported file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ message: "File must be 10 MB or smaller." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email?.toLowerCase() });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const b64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `ppm/client-documents/${user._id}`,
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
  });

  const doc = {
    originalName: file.name,
    storedName: result.public_id,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: result.secure_url,
    uploadedByClient: true,
    docType: "Legal",
    docStatus: "Pending",
    uploadedAt: new Date(),
  };

  user.assignedDocuments = [...(user.assignedDocuments ?? []), doc];
  await user.save();

  return NextResponse.json({ success: true, document: doc }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "client") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const storedName = typeof body?.storedName === "string" ? body.storedName : "";
  if (!storedName) {
    return NextResponse.json({ message: "storedName is required" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email?.toLowerCase() });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const doc = (user.assignedDocuments ?? []).find(
    (d: { storedName: string }) => d.storedName === storedName
  );
  if (!doc) {
    return NextResponse.json({ message: "Document not found" }, { status: 404 });
  }
  if (!doc.requiresSignature) {
    return NextResponse.json({ message: "This document does not require a signature" }, { status: 400 });
  }

  doc.docStatus = "Signed";
  await user.save();

  return NextResponse.json({ success: true, document: doc });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session || session.user?.role !== "client") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const storedName = typeof body?.storedName === "string" ? body.storedName : "";

  if (!storedName) {
    return NextResponse.json({ message: "storedName is required" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email?.toLowerCase() });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const doc = (user.assignedDocuments ?? []).find(
    (d: { storedName: string; uploadedByClient?: boolean }) => d.storedName === storedName
  );

  if (!doc) {
    return NextResponse.json({ message: "Document not found" }, { status: 404 });
  }

  if (!doc.uploadedByClient) {
    return NextResponse.json(
      { message: "You can only delete documents you uploaded yourself." },
      { status: 403 }
    );
  }

  const resourceType = doc.fileType?.startsWith("image/") ? "image" : "raw";
  await cloudinary.uploader.destroy(storedName, { resource_type: resourceType }).catch(() => {});

  user.assignedDocuments = (user.assignedDocuments ?? []).filter(
    (d: { storedName: string }) => d.storedName !== storedName
  );
  await user.save();

  return NextResponse.json({ success: true });
}
