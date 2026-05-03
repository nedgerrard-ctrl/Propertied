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
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

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
    return NextResponse.json(
      { message: "Expected multipart/form-data" },
      { status: 400 }
    );
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
    return NextResponse.json(
      { message: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { message: "File must be 10 MB or smaller" },
      { status: 400 }
    );
  }

  await connectDB();

  const client = await User.findOne({ _id: id, role: "client" });
  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeOriginalName = sanitizeFilename(file.name);
  const uniquePrefix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const storedName = `${uniquePrefix}-${safeOriginalName}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "client-documents",
    id
  );
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, storedName), buffer);

  const doc = {
    originalName: file.name,
    storedName,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: `/uploads/client-documents/${id}/${storedName}`,
    title,
    docType,
    docStatus: "Pending",
    requiresSignature,
    uploadedAt: new Date(),
  };

  client.assignedDocuments = [...(client.assignedDocuments ?? []), doc];
  await client.save();

  return NextResponse.json(
    { success: true, document: doc },
    { status: 201 }
  );
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

  const client = await User.findOne({ _id: id, role: "client" });
  if (!client) {
    return NextResponse.json({ message: "Client not found" }, { status: 404 });
  }

  const doc = client.assignedDocuments?.find(
    (d: { storedName: string }) => d.storedName === storedName
  );

  if (doc) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "client-documents",
      id,
      storedName
    );
    await fs.unlink(filePath).catch(() => {});
  }

  client.assignedDocuments = (client.assignedDocuments ?? []).filter(
    (d: { storedName: string }) => d.storedName !== storedName
  );
  await client.save();

  return NextResponse.json({ success: true });
}
