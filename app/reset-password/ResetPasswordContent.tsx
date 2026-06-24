"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  isValidPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "@/lib/password-validation";

function PasswordStrengthHints({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter (A–Z)", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a–z)", met: /[a-z]/.test(password) },
    { label: "Number (0–9)", met: /\d/.test(password) },
    { label: "Special character (!@#…)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {checks.map(({ label, met }) => (
        <div key={label} className="flex items-center gap-1.5">
          {met ? (
            <svg
              className="h-3.5 w-3.5 flex-shrink-0 text-[#4a9b5f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5 flex-shrink-0 text-[#c8bfb4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <circle cx="12" cy="12" r="3.5" fill="currentColor" />
            </svg>
          )}
          <span className={`text-[12px] ${met ? "text-[#4a9b5f]" : "text-[#9a8f83]"}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
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

    if (!isValidPassword(password)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
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
      <Navbar />

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
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full bg-transparent text-[15px] text-[#2f2923] outline-none placeholder:text-[#a49a8d]"
                    required
                  />
                </div>
                {(passwordFocused || password.length > 0) && (
                  <PasswordStrengthHints password={password} />
                )}
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

      <Footer />
    </main>
  );
}