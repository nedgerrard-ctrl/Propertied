"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SpotlightCard from "../components/ui/SpotlightCard";
import Waves from "../components/ui/Waves";
import Navbar from "../components/Navbar";

type FieldErrors = Partial<Record<string, string>>;

function getFieldClass(hasError: boolean) {
  return [
    "w-full rounded-xl bg-[#fbfaf7] px-4 py-3 text-[15px] text-[#2f2923] outline-none transition placeholder:text-[#a49a8d]",
    hasError
      ? "border border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10"
      : "border border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10",
  ].join(" ");
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+61");
  const [clientType, setClientType] = useState<"buyer" | "investor" | "developer" | "">("");
  const [companyName, setCompanyName] = useState("");
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          phoneCountryCode,
          clientType,
          companyName,
          isExistingClient: clientType !== "developer" && isExistingClient,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setError(data.message || "Please correct the highlighted fields.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-6">
        <Navbar />
        <div className="w-full max-w-md rounded-2xl border border-[#ddd5c8] bg-white p-10 text-center shadow-lg">
          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
              isExistingClient ? "bg-amber-100" : "bg-emerald-100"
            }`}
          >
            {isExistingClient ? (
              <svg viewBox="0 0 20 20" className="h-7 w-7 fill-amber-600">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-10.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm0 7a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-7 w-7 fill-emerald-600">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-medium text-[#2f2923]">
            {isExistingClient ? "Account pending approval" : "Account created"}
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-[#6e655c]">
            {isExistingClient
              ? "Your account has been created and is pending review. Our team will verify your existing client status — you'll gain access to client-only content once approved."
              : "Your account has been created successfully. You will be redirected to the sign-in page shortly."}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-[13px] text-[#b89464] underline underline-offset-4 hover:text-[#2f2923]"
          >
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Navbar />

      {/* Left panel */}
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
            Client Portal
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
            Melbourne&rsquo;s specialist in off-the-plan and established
            residential property — serving a $50M+ managed portfolio.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-[12px] text-[#5c5248]">
            &copy; {new Date().getFullYear()} PPM Pty Ltd &mdash; All rights
            reserved
          </p>
        </div>
      </div>

      {/* Right panel */}
      <SpotlightCard
        className="flex flex-1 flex-col items-center justify-center bg-[#f4f1ea] px-6 py-14"
        spotlightColor="rgba(184, 148, 100, 0.22)"
      >
        <div className="w-full max-w-[480px]">
          <div className="mb-10 lg:hidden">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#9a8f83]">
              Property Project Marketing
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-[2rem] font-medium tracking-tight text-[#2f2923] sm:text-[2.4rem]">
              Create account
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6e655c]">
              Register as a buyer or investor to access your PPM client portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
                aria-invalid={Boolean(fieldErrors.name)}
                className={getFieldClass(Boolean(fieldErrors.name))}
              />
              {fieldErrors.name && (
                <p className="mt-1.5 text-[13px] text-[#dc2626]">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
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
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                className={getFieldClass(Boolean(fieldErrors.email))}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-[13px] text-[#dc2626]">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                Phone number{" "}
                <span className="font-normal text-[#a49a8d]">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+61"
                  value={phoneCountryCode}
                  onChange={(e) => {
                    setPhoneCountryCode(e.target.value);
                    clearFieldError("phoneCountryCode");
                  }}
                  aria-label="Country code"
                  className={[
                    "w-20 shrink-0 rounded-xl bg-[#fbfaf7] px-3 py-3 text-[15px] text-[#2f2923] outline-none transition placeholder:text-[#a49a8d]",
                    fieldErrors.phoneCountryCode
                      ? "border border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10"
                      : "border border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10",
                  ].join(" ")}
                />
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="412 345 678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={getFieldClass(Boolean(fieldErrors.phone))}
                />
              </div>
              {(fieldErrors.phone || fieldErrors.phoneCountryCode) && (
                <p className="mt-1.5 text-[13px] text-[#dc2626]">
                  {fieldErrors.phone || fieldErrors.phoneCountryCode}
                </p>
              )}
            </div>

            {/* Client type */}
            <div>
              <p className="mb-2 text-[13px] font-medium text-[#4d453d]">
                I am a
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "buyer", label: "Buyer" },
                    { value: "investor", label: "Investor" },
                    { value: "developer", label: "Developer" },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setClientType(value);
                      clearFieldError("clientType");
                      if (value === "developer") setIsExistingClient(false);
                    }}
                    className={[
                      "rounded-xl border px-4 py-3 text-[14px] font-medium transition",
                      clientType === value
                        ? "border-[#2f2923] bg-[#2f2923] text-[#f4f1ea]"
                        : "border-[#c8bfb4] bg-[#fbfaf7] text-[#4d453d] hover:border-[#2f2923]",
                      fieldErrors.clientType ? "border-[#dc2626]" : "",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {fieldErrors.clientType && (
                <p className="mt-1.5 text-[13px] text-[#dc2626]">
                  {fieldErrors.clientType}
                </p>
              )}
            </div>

            {/* Company name — shown for developers */}
            {clientType === "developer" && (
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
                >
                  Company name{" "}
                  <span className="font-normal text-[#a49a8d]">(optional)</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Acme Developments Pty Ltd"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    clearFieldError("companyName");
                  }}
                  aria-invalid={Boolean(fieldErrors.companyName)}
                  className={getFieldClass(Boolean(fieldErrors.companyName))}
                />
                {fieldErrors.companyName && (
                  <p className="mt-1.5 text-[13px] text-[#dc2626]">
                    {fieldErrors.companyName}
                  </p>
                )}
              </div>
            )}

            {/* Existing client — hidden for developers */}
            {clientType !== "developer" && (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#c8bfb4] bg-[#fbfaf7] px-4 py-3.5 transition hover:border-[#2f2923]">
                <input
                  type="checkbox"
                  checked={isExistingClient}
                  onChange={(e) => setIsExistingClient(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-400 accent-[#2f2923]"
                />
                <div>
                  <p className="text-[14px] font-medium text-[#2f2923]">
                    I&rsquo;m an existing PPM client
                  </p>
                  <p className="mt-0.5 text-[12px] leading-5 text-[#7a7166]">
                    Select this if you already have an active portfolio managed by
                    PPM. Your account will be reviewed and approved by our team.
                  </p>
                </div>
              </label>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                className={getFieldClass(Boolean(fieldErrors.password))}
              />
              {fieldErrors.password ? (
                <p className="mt-1.5 text-[13px] text-[#dc2626]">
                  {fieldErrors.password}
                </p>
              ) : (
                <p className="mt-1.5 text-[12px] text-[#a49a8d]">
                  Min. 8 characters with uppercase, lowercase, number, and special character.
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-[13px] font-medium text-[#4d453d]"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                className={getFieldClass(Boolean(fieldErrors.confirmPassword))}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1.5 text-[13px] text-[#dc2626]">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Global error */}
            {error &&
              !Object.values(fieldErrors).some(Boolean) && (
                <div className="rounded-xl border border-[#d4b7b0] bg-[#f7e9e6] px-4 py-3 text-[13px] text-[#8a3d31]">
                  {error}
                </div>
              )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#7a7166]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#b89464] underline underline-offset-4 hover:text-[#2f2923]"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-[12px] text-[#a49a8d]">
            By creating an account, you agree to our Terms of Use and Privacy
            Policy.
          </p>
        </div>
      </SpotlightCard>
    </div>
  );
}
