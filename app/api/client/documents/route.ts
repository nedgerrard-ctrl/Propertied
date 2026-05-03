import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function sanitizeFilename(name: string) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  const safeBase = base
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();
  return `${safeBase || "document"}${safeExt}`;
}

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
      {
        message:
          "Unsupported file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.",
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { message: "File must be 10 MB or smaller." },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email?.toLowerCase(),
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeOriginalName = sanitizeFilename(file.name);
  const uniquePrefix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const storedName = `${uniquePrefix}-${safeOriginalName}`;

  const userId = user._id.toString();
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "client-documents",
    userId
  );
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, storedName), buffer);

  const doc = {
    originalName: file.name,
    storedName,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: `/uploads/client-documents/${userId}/${storedName}`,
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

  const userId = user._id.toString();
  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "client-documents",
    userId,
    storedName
  );
  await fs.unlink(filePath).catch(() => {});

  user.assignedDocuments = (user.assignedDocuments ?? []).filter(
    (d: { storedName: string }) => d.storedName !== storedName
  );
  await user.save();

  return NextResponse.json({ success: true });
}
