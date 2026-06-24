"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ppm_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage not available (private browsing, etc.) — show banner anyway
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[999] border-t border-[#e3d8ca] bg-[#f6f2eb] px-6 py-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-[1.7] text-[#3d3530]">
          This website uses cookies and similar technologies for session management and
          aggregate analytics (Google Analytics). By continuing to use this site you accept
          our use of cookies.{" "}
          <Link
            href="/privacy-policy#cookies"
            className="text-[#c8a96e] underline underline-offset-2 hover:text-[#a8894e]"
          >
            Learn more
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-none border border-[#2f2923] bg-[#2f2923] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f4f1ea] transition hover:bg-[#1c1814]"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
