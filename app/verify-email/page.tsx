"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message ?? "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.message ?? "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md rounded-2xl bg-white px-10 py-12 shadow-sm text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#2f2923]" />
              <p className="mt-6 text-[14px] text-[#6e655c]">Verifying your email…</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <svg viewBox="0 0 20 20" className="h-7 w-7 fill-emerald-600">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="mt-5 text-2xl font-medium text-[#2f2923]">Email verified</h1>
              <p className="mt-3 text-[14px] leading-7 text-[#6e655c]">{message}</p>
              <Link
                href="/login"
                className="mt-8 inline-block rounded-xl bg-[#2f2923] px-8 py-3 text-[13px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c]"
              >
                Sign in
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg viewBox="0 0 20 20" className="h-7 w-7 fill-red-600">
                  <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-10.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                </svg>
              </div>
              <h1 className="mt-5 text-2xl font-medium text-[#2f2923]">Verification failed</h1>
              <p className="mt-3 text-[14px] leading-7 text-[#6e655c]">{message}</p>
              <p className="mt-4 text-[13px] text-[#9a8f83]">
                The link may have expired. Please sign up again or contact support.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-block rounded-xl bg-[#2f2923] px-8 py-3 text-[13px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c]"
              >
                Back to sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
