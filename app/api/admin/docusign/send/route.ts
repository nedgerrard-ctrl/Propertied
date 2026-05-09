import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendDocuSignEnvelope } from "@/lib/docusign";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "admin") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  }

  const signerName = (formData.get("signerName") as string | null)?.trim() ?? "";
  const signerEmail = (formData.get("signerEmail") as string | null)?.trim().toLowerCase() ?? "";
  const documentTitle = (formData.get("documentTitle") as string | null)?.trim() ?? "";
  const file = formData.get("document") as File | null;

  if (!signerName) {
    return NextResponse.json({ message: "Signer name is required." }, { status: 422 });
  }
  if (!signerEmail || !EMAIL_RE.test(signerEmail)) {
    return NextResponse.json({ message: "A valid signer email is required." }, { status: 422 });
  }
  if (!documentTitle) {
    return NextResponse.json({ message: "Document title is required." }, { status: 422 });
  }
  if (!file) {
    return NextResponse.json({ message: "A PDF file is required." }, { status: 422 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ message: "Only PDF files are accepted." }, { status: 422 });
  }
  if (file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ message: "PDF must be under 10 MB." }, { status: 422 });
  }

  const pdfBytes = Buffer.from(await file.arrayBuffer());

  try {
    const envelopeId = await sendDocuSignEnvelope({
      signerName,
      signerEmail,
      documentTitle,
      pdfBytes,
    });
    return NextResponse.json({ envelopeId });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send envelope via DocuSign.";
    console.error("[DocuSign] send error:", err);
    return NextResponse.json({ message }, { status: 500 });
  }
}
