"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className={
          variant === 'dark'
            ? 'text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 transition hover:text-white'
            : 'rounded border border-neutral-300 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-500 hover:text-neutral-900'
        }
      >
        Log out
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">
              Confirm logout
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Are you sure you want to log out of the admin dashboard?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700 disabled:opacity-50"
              >
                {loading ? "Logging out..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
