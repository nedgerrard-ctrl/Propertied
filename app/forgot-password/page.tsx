"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devResetLink, setDevResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setDevResetLink("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to process request.");
        setLoading(false);
        return;
      }

      setMessage(
        data.message ||
          "If an account exists for that email, a reset link has been sent."
      );

      if (data.resetLink) {
        setDevResetLink(data.resetLink);
      }
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
                Forgot password
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6e655c] sm:text-base">
                Enter your email and we’ll send a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#4d453d]"
                >
                  Email address
                </label>
                <div className="rounded-2xl border border-[#8e857a] bg-[#fbfaf7] px-4 py-3">
                  <input
                    id="email"
                    type="email"
                    placeholder="hello@propertyprojectmarketing.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              {devResetLink ? (
                <div className="rounded-2xl border border-[#d8d0c4] bg-[#f7f3ec] px-4 py-3 text-sm text-[#5b534b] break-all">
                  <span className="font-medium">Development reset link:</span>{" "}
                  <a
                    href={devResetLink}
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {devResetLink}
                  </a>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl border border-[#2f2923] bg-[#2f2923] px-4 py-3 text-base font-medium text-[#fbfaf7] transition hover:bg-[#453d35] hover:border-[#453d35] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending link..." : "Send reset link"}
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