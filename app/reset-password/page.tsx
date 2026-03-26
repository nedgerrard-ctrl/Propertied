"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");
  setMessage("");

  if (!token) {
    setError("Missing reset token.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Unable to reset password.");
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#2f2923]">
      <header className="border-b border-[#d8d0c4] bg-[#ebe6dd]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-[15px] font-semibold uppercase tracking-[0.18em] text-[#2f2923]"
          >
            Property Project Marketing Pty Ltd
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              About Us
            </Link>
            <Link
              href="/buyers"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Buyers
            </Link>
            <Link
              href="/services"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Services
            </Link>
            <Link
              href="/developers"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Developers
            </Link>
            <Link
              href="/blog"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Contact
            </Link>
            <Link
              href="/projects"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6e655c] transition hover:text-[#2f2923]"
            >
              Projects
            </Link>
            <Link
              href="/login"
              className="text-[11px] uppercase tracking-[0.18em] text-[#2f2923]"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <section className="flex min-h-screen items-center justify-center px-6 py-14">
        <div className="w-full max-w-[560px] rounded-[28px] border border-[#d8d0c4] bg-[#fbfaf7] shadow-[0_10px_30px_rgba(47,41,35,0.06)]">
          <div className="px-8 pb-10 pt-10 sm:px-14">
            <div className="mb-8 text-center">
              <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#9a8f83]">
                Property Project Marketing
              </p>
              <h1 className="mt-5 text-4xl font-medium tracking-tight text-[#2f2923] sm:text-5xl">
                Reset password
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6e655c] sm:text-base">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#4d453d]"
                >
                  New password
                </label>
                <div className="rounded-2xl border border-[#8e857a] bg-[#fbfaf7] px-4 py-3">
                  <input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-[#2f2923] outline-none placeholder:text-[#a49a8d]"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#4d453d]"
                >
                  Confirm new password
                </label>
                <div className="rounded-2xl border border-[#8e857a] bg-[#fbfaf7] px-4 py-3">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-[#2f2923] outline-none placeholder:text-[#a49a8d]"
                    required
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-[#d4b7b0] bg-[#f7e9e6] px-4 py-3 text-sm text-[#8a3d31]">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-2xl border border-[#cfc6b8] bg-[#f7f3ec] px-4 py-3 text-sm text-[#5b534b]">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-[#2f2923] bg-[#2f2923] px-4 py-3 text-base font-medium text-[#fbfaf7] transition hover:bg-[#453d35] hover:border-[#453d35] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating password..." : "Reset password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-[#6e655c] underline underline-offset-4 hover:text-[#2f2923]"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#d8d0c4] bg-[#ebe6dd]">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center md:flex-row md:text-left">
                <p className="text-sm text-[#7a7166]">
                  © 2026 Property Project Marketing Pty Ltd
                </p>
      
                <div className="flex items-center gap-6">
                  <Link
                    href="#"
                    className="text-[12px] uppercase tracking-[0.18em] text-[#7a7166] transition hover:text-[#2f2923]"
                  >
                    Facebook
                  </Link>
                  <Link
                    href="#"
                    className="text-[12px] uppercase tracking-[0.18em] text-[#7a7166] transition hover:text-[#2f2923]"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="#"
                    className="text-[12px] uppercase tracking-[0.18em] text-[#7a7166] transition hover:text-[#2f2923]"
                  >
                    LinkedIn
                  </Link>
                </div>
              </div>
            </footer>
    </main>
  );
}