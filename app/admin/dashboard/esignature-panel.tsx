"use client";

import { useRef, useState } from "react";

type SendState = "idle" | "sending" | "success" | "error";

export default function ESignaturePanel() {
  const [open, setOpen] = useState(false);

  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [sendState, setSendState] = useState<SendState>("idle");
  const [envelopeId, setEnvelopeId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function resetForm() {
    setSignerName("");
    setSignerEmail("");
    setDocumentTitle("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setSendState("idle");
    setEnvelopeId("");
    setErrorMsg("");
  }

  async function handleSend() {
    setErrorMsg("");
    setEnvelopeId("");
    setSendState("sending");

    const formData = new FormData();
    formData.append("signerName", signerName.trim());
    formData.append("signerEmail", signerEmail.trim());
    formData.append("documentTitle", documentTitle.trim());
    if (file) formData.append("document", file);

    try {
      const res = await fetch("/api/admin/docusign/send", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setEnvelopeId(data.envelopeId);
        setSendState("success");
        // Clear inputs but keep panel open so admin can see the success
        setSignerName("");
        setSignerEmail("");
        setDocumentTitle("");
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setErrorMsg(data.message ?? "Failed to send envelope.");
        setSendState("error");
      }
    } catch {
      setErrorMsg("Network error — please try again.");
      setSendState("error");
    }
  }

  const sending = sendState === "sending";
  const canSend =
    !sending &&
    signerName.trim().length > 0 &&
    signerEmail.trim().length > 0 &&
    documentTitle.trim().length > 0 &&
    file !== null;

  return (
    <div className="rounded border border-neutral-200 bg-white">
      {/* Header toggle */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (open) resetForm();
        }}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {/* DocuSign-style envelope icon */}
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1f1a17]">
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-white">
              <path d="M2.003 5.884 10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884Z" />
              <path d="m18 8.118-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118Z" />
            </svg>
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Send via DocuSign (eSignature)
          </span>
        </div>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 fill-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-6 pb-6 pt-4 space-y-4">
          {/* Success banner */}
          {sendState === "success" && (
            <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-[13px] font-medium text-emerald-800">
                Envelope sent successfully.
              </p>
              <p className="mt-1 text-[12px] text-emerald-700">
                Envelope ID:{" "}
                <span className="font-mono font-semibold">{envelopeId}</span>
              </p>
              <p className="mt-1 text-[11px] text-emerald-600">
                The signer will receive a DocuSign email to review and sign the document.
              </p>
            </div>
          )}

          {/* Error banner */}
          {sendState === "error" && errorMsg && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-[13px] text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* Signer name */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Signer Name
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Smith"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              disabled={sending}
              maxLength={200}
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 disabled:opacity-60"
            />
          </div>

          {/* Signer email */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Signer Email
            </label>
            <input
              type="email"
              placeholder="e.g. jane@example.com"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
              disabled={sending}
              maxLength={254}
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 disabled:opacity-60"
            />
          </div>

          {/* Document title */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g. Property Purchase Agreement"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              disabled={sending}
              maxLength={200}
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 disabled:opacity-60"
            />
          </div>

          {/* PDF upload */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              PDF Document
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded border border-neutral-200 bg-white px-3 py-2.5 text-[13px] transition hover:border-neutral-400 ${
                sending ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 shrink-0 fill-neutral-400"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM6.293 6.707a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L11 5.414V13a1 1 0 1 1-2 0V5.414L7.707 6.707a1 1 0 0 1-1.414 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className={`truncate ${file ? "text-neutral-800" : "text-neutral-400"}`}>
                {file ? file.name : "Choose PDF file…"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                disabled={sending}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f && f.type !== "application/pdf") {
                    setErrorMsg("Only PDF files are accepted.");
                    setSendState("error");
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  } else {
                    setFile(f);
                    if (sendState === "error") setSendState("idle");
                    setErrorMsg("");
                  }
                }}
              />
            </label>
            <p className="mt-1.5 text-[11px] text-neutral-400">PDF only · max 10 MB</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="rounded border border-[#1f1a17] bg-[#1f1a17] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                    />
                  </svg>
                  Sending…
                </span>
              ) : (
                "Send via DocuSign"
              )}
            </button>
            {(sendState === "success" || sendState === "error") && (
              <button
                onClick={resetForm}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 underline hover:text-neutral-700"
              >
                Send another
              </button>
            )}
          </div>

          <p className="text-[11px] leading-5 text-neutral-400">
            The signer will receive an email from DocuSign with a link to review and sign the
            document. A signature field will be placed on page 1 of the PDF.
          </p>
        </div>
      )}
    </div>
  );
}
