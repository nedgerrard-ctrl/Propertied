import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const ALLOWED_EXT = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]);

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  // Accept if either MIME or extension matches (some browsers omit MIME for doc types)
  if (!ALLOWED_MIME.has(file.type) && !ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX." },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds the 20 MB limit." }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const b64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type || "application/octet-stream"};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "ppm/docs",
    resource_type: "raw",
    use_filename: true,
    unique_filename: true,
    public_id: `${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`,
  });

  return NextResponse.json({
    path:     result.secure_url,
    fileName: file.name,
  });
}
