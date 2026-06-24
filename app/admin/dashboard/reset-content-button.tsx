"use client";

import { useState } from "react";

export default function ResetContentButton() {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<string | null>(null);

  async function handleReset() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/content/reset-all", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setResult("✓ All page content reset to defaults. Reload the site to see changes.");
      } else {
        setResult(`Error: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      setResult("Network error — try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-red-400/70 transition hover:text-red-400"
      >
        Reset Content
      </button>

      {result && (
        <span className="text-[11px] text-green-400 font-medium">{result}</span>
      )}

      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Reset all content to defaults?</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This will delete all saved page content from the database. Every page will immediately fall back to the code defaults. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="rounded border border-red-600 bg-red-600 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Resetting…" : "Yes, Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
