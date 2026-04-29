"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import SpotlightCard from "../components/ui/SpotlightCard";
import Waves from "../components/ui/Waves";
import Navbar from "../components/Navbar";

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

function getFieldClass(hasError: boolean) {
  return [
    "w-full rounded-xl bg-[#fbfaf7] px-4 py-3 text-[15px] text-[#2f2923] outline-none transition placeholder:text-[#a49a8d]",
    hasError
      ? "border border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10"
      : "border border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10",
  ].join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      }
    }
    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const validationResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const validationData = await validationResponse.json();

      if (!validationResponse.ok) {
        setFieldErrors(validationData.fieldErrors ?? {});
        setError(validationData.message || "Please correct the highlighted fields.");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setLoading(false);
        setError("Invalid email or password.");
        setFieldErrors({
          password: "Invalid email or password.",
        });
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      }

      if (role === "client") {
        window.location.href = "/client/dashboard";
        return;
      }

      setLoading(false);
      setError("Your account does not have a valid role.");
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
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
            Admin Portal
          </p>
          <h1 className="mt-4 text-[2.6rem] font-medium leading-[1.1] tracking-tight text-[#f4f1ea]">
            Property
            <br />
            Project
            <br />
            Marketing
          </h1>
        </div>

        <div className="relative z-10">
          <div className="mb-8 h-px w-16 bg-[#b89464]" />
          <p className="max-w-xs text-[15px] leading-7 text-[#9a8f83]">
            Melbourne&rsquo;s specialist in off-the-plan and established residential
            property — serving a $50M+ managed portfolio.
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
        <div className="w-full max-w-[440px]">
          <div className="mb-10 lg:hidden">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#9a8f83]">
              Property Project Marketing
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-[2rem] font-medium tracking-tight text-[#2f2923] sm:text-[2.4rem]">
              Sign in
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6e655c]">
              Access your portal to manage enquiries and leads.{" "}
              <Link
                href="/signup"
                className="text-[#2f2923] underline underline-offset-4 transition hover:text-[#b89464]"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@ppm.com.au"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                className={getFieldClass(Boolean(fieldErrors.email))}
              />
              {fieldErrors.email ? (
                <p className="mt-3 text-[14px] text-[#dc2626]">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[13px] font-medium text-[#4d453d]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-[#8a7f74] underline underline-offset-4 transition hover:text-[#2f2923]"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                className={getFieldClass(Boolean(fieldErrors.password))}
              />
              {fieldErrors.password ? (
                <p className="mt-3 text-[14px] text-[#dc2626]">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {error && !fieldErrors.email && !fieldErrors.password ? (
              <div className="rounded-xl border border-[#d4b7b0] bg-[#f7e9e6] px-4 py-3 text-[13px] text-[#8a3d31]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#ddd5c8]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#a49a8d]">
              Secure access
            </span>
            <div className="h-px flex-1 bg-[#ddd5c8]" />
          </div>

          <div className="space-y-2.5 text-[13px] text-[#7a7166]">
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-[#b89464]">—</span>
              Use your registered admin email and password.
            </p>
            <p className="flex items-start gap-2">
              <span className="mt-0.5 text-[#b89464]">—</span>
              Access level is determined by your account role.
            </p>
          </div>

          <p className="mt-10 text-[12px] text-[#a49a8d]">
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </p>
        </div>
      </SpotlightCard>
    </div>
  );
}