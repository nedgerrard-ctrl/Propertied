"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import SpotlightCard from "@/app/components/ui/SpotlightCard";
import Waves from "@/app/components/ui/Waves";

type ResetFieldErrors = {
  token?: string;
  password?: string;
  confirmPassword?: string;
};

function getFieldClass(hasError: boolean) {
  return [
    "w-full rounded-xl bg-[#fbfaf7] px-4 py-3 text-[15px] text-[#2f2923] outline-none transition placeholder:text-[#a49a8d]",
    hasError
      ? "border border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10"
      : "border border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10",
  ].join(" ");
}

function validatePassword(password: string): string {
  if (!password) return "Enter a new password";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Include at least 1 uppercase letter";
  if (!/[a-z]/.test(password)) return "Include at least 1 lowercase letter";
  if (!/[0-9]/.test(password)) return "Include at least 1 number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Include at least 1 special character";
  return "";
}

function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string {
  if (!confirmPassword) return "Confirm your new password";
  if (confirmPassword !== password) return "Passwords do not match";
  return "";
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ResetFieldErrors>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const nextFieldErrors: ResetFieldErrors = {
      token: token ? "" : "Reset token is missing",
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setFieldErrors(nextFieldErrors);

    if (
      nextFieldErrors.token ||
      nextFieldErrors.password ||
      nextFieldErrors.confirmPassword
    ) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setMessage(data.message || "Please correct the highlighted fields.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setMessage(data.message || "Your password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Navbar />

      <div className="relative hidden overflow-hidden bg-[#2f2923] px-14 py-12 lg:flex lg:w-[46%] flex-col justify-between">
        <Waves
          lineColor="rgba(184, 148, 100, 0.18)"
          backgroundColor="transparent"
          waveSpeedX={0.03}
          waveSpeedY={0.004}
          waveAmpX={28}
          waveAmpY={14}
          xGap={24}
          yGap={40}
          friction={0.93}
          tension={0.004}
          maxCursorMove={80}
        />

        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#b89464]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-[400px] w-[400px] rounded-full bg-[#b89464]/8 blur-[100px]" />

        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#b89464]">
            Account Recovery
          </p>
          <h1 className="mt-4 text-[2.6rem] font-medium leading-[1.1] tracking-tight text-[#f4f1ea]">
            Reset
            <br />
            Your
            <br />
            Password
          </h1>
        </div>

        <div className="relative z-10">
          <div className="mb-8 h-px w-16 bg-[#b89464]" />
          <p className="max-w-xs text-[15px] leading-7 text-[#9a8f83]">
            Choose a new password for your account. Use a strong password you
            have not used before.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-[12px] text-[#5c5248]">
            &copy; {new Date().getFullYear()} PPM Pty Ltd &mdash; All rights reserved
          </p>
        </div>
      </div>

      <SpotlightCard
        className="flex flex-1 flex-col items-center justify-center bg-[#f4f1ea] px-6 py-14"
        spotlightColor="rgba(184, 148, 100, 0.22)"
      >
        <div className="w-full max-w-[460px]">
          <div className="mb-10 lg:hidden">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#9a8f83]">
              Property Project Marketing
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-[2rem] font-medium tracking-tight text-[#2f2923] sm:text-[2.4rem]">
              Create a new password
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6e655c]">
              Enter your new password below. Your reset link must still be valid.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(e) => {
                    const nextPassword = e.target.value;
                    setPassword(nextPassword);
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: validatePassword(nextPassword),
                      confirmPassword: confirmPassword
                        ? validateConfirmPassword(nextPassword, confirmPassword)
                        : prev.confirmPassword,
                    }));
                  }}
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={`${getFieldClass(Boolean(fieldErrors.password))} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#5f5750]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {fieldErrors.password ? (
                <p className="mt-3 text-[14px] text-[#dc2626]">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
              >
                Confirm new password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const nextConfirmPassword = e.target.value;
                    setConfirmPassword(nextConfirmPassword);
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(
                        password,
                        nextConfirmPassword
                      ),
                    }));
                  }}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  className={`${getFieldClass(
                    Boolean(fieldErrors.confirmPassword)
                  )} pr-20`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#5f5750]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {fieldErrors.confirmPassword ? (
                <p className="mt-3 text-[14px] text-[#dc2626]">
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            {fieldErrors.token ? (
              <div className="rounded-xl border border-[#e0b8b2] bg-[#f8eaea] px-4 py-3 text-[13px] text-[#9b3f33]">
                {fieldErrors.token}
              </div>
            ) : null}

            {message && !fieldErrors.password && !fieldErrors.confirmPassword && !fieldErrors.token ? (
              <div
                className={`rounded-xl px-4 py-3 text-[13px] ${
                  success
                    ? "border border-[#b7d8c1] bg-[#edf8f1] text-[#256b3f]"
                    : "border border-[#e0b8b2] bg-[#f8eaea] text-[#9b3f33]"
                }`}
              >
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating password..." : "Reset password"}
            </button>
          </form>

          <div className="mt-8">
            <Link
              href="/login"
              className="text-[13px] text-[#7a7166] underline underline-offset-4 transition hover:text-[#2f2923]"
            >
              Back to login
            </Link>
          </div>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#ddd5c8]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#a49a8d]">
              Password rules
            </span>
            <div className="h-px flex-1 bg-[#ddd5c8]" />
          </div>

          <div className="space-y-2.5 text-[13px] text-[#7a7166]">
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-[#b89464]">—</span>
              At least 8 characters.
            </p>
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-[#b89464]">—</span>
              Include uppercase, lowercase, and a number.
            </p>
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-[#b89464]">—</span>
              Include at least 1 special character.
            </p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4f1ea]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}