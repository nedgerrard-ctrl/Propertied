"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const AUSTRALIAN_CITIES = [
  "Melbourne",
  "Sydney",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Canberra",
  "Hobart",
  "Darwin",
  "Gold Coast",
  "Newcastle",
  "Wollongong",
  "Geelong",
  "Sunshine Coast",
  "Townsville",
  "Cairns",
  "Toowoomba",
  "Ballarat",
  "Bendigo",
  "Albury",
  "Launceston",
];

type UserType = "buyer_investor" | "developer" | "existing_client";
type FieldErrors = Record<string, string>;

function getFieldClass(hasError: boolean) {
  return [
    "w-full rounded-xl bg-[#fbfaf7] px-4 py-3 text-[15px] text-[#2f2923] outline-none transition placeholder:text-[#a49a8d]",
    hasError
      ? "border border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10"
      : "border border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10",
  ].join(" ");
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-[13px] text-[#dc2626]">{msg}</p>;
}

const ROLE_OPTIONS: { value: UserType; label: string; description: string }[] = [
  {
    value: "buyer_investor",
    label: "Buyer",
    description: "Looking to purchase or invest in property",
  },
  {
    value: "developer",
    label: "Developer",
    description: "Property developer or project partner",
  },
  {
    value: "existing_client",
    label: "Existing Client",
    description: "Already working with PPM — request account access",
  },
];

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function focus(i: number) {
    inputRefs.current[i]?.focus();
  }

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[index] = digit;
    const newVal = next.join("").slice(0, 6);
    onChange(newVal);
    if (digit && index < 5) focus(index + 1);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = value.split("");
        next[index] = "";
        onChange(next.join(""));
      } else if (index > 0) {
        const next = value.split("");
        next[index - 1] = "";
        onChange(next.join(""));
        focus(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focus(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      focus(index + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.slice(0, 6));
    focus(Math.min(pasted.length, 5));
  }

  const boxBase =
    "h-14 w-11 rounded-xl border text-center text-[22px] font-semibold text-[#2f2923] outline-none transition bg-[#fbfaf7]";
  const boxIdle = "border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10";
  const boxError = "border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10";

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={[boxBase, hasError ? boxError : boxIdle].join(" ")}
          aria-label={`Digit ${i + 1}`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<"role" | "details" | "verify">("role");
  const [userType, setUserType] = useState<UserType | "">("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [locationKind, setLocationKind] = useState<"local" | "overseas" | "">("");
  const [city, setCity] = useState("");
  const [clientType, setClientType] = useState<"investor" | "owner-occupier" | "">("");
  const [companyName, setCompanyName] = useState("");
  const [abn, setAbn] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // OTP step state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [submittingOtp, setSubmittingOtp] = useState(false);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleRoleSelect(role: UserType) {
    setUserType(role);
    setClientType("");
    setFieldErrors({});
  }

  function handleRoleContinue() {
    if (!userType) {
      setFieldErrors({ userType: "Please select a role to continue." });
      return;
    }
    setStep("details");
  }

  // Called when user clicks "Create account" on the details form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setGeneralError(data.message || "Please correct the highlighted fields.");
        setLoading(false);
        return;
      }

      // Code sent — move to verify step
      setOtp("");
      setOtpError("");
      setResendCooldown(60);
      setStep("verify");
      setLoading(false);
    } catch {
      setGeneralError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleResend() {
    if (resendCooldown > 0) return;
    setOtpError("");
    setResendCooldown(60);
    try {
      await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
    } catch {
      // silently fail — user can try again
    }
  }

  // Called when user submits OTP on the verify step
  async function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOtpError("");

    if (otp.replace(/\D/g, "").length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    setSubmittingOtp(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          userType,
          clientType,
          phone,
          locationKind,
          city,
          companyName,
          abn,
          verificationCode: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors?.verificationCode) {
          setOtpError(data.fieldErrors.verificationCode);
        } else if (data.fieldErrors) {
          // Form-level error (e.g. email taken race condition) — go back to details
          setFieldErrors(data.fieldErrors);
          setGeneralError(data.message || "Please correct the highlighted fields.");
          setStep("details");
        } else {
          setOtpError(data.message || "Verification failed. Please try again.");
        }
        setSubmittingOtp(false);
        return;
      }

      setSuccess(true);
      setSubmittingOtp(false);
    } catch {
      setOtpError("Something went wrong. Please try again.");
      setSubmittingOtp(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f1ea]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-6 py-20">
          <div className="w-full max-w-md rounded-2xl border border-[#ddd5c8] bg-white px-10 py-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f7ee]">
              <svg className="h-8 w-8 text-[#4a9b5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mb-3 text-[1.6rem] font-medium tracking-tight text-[#2f2923]">
              Account created!
            </h2>
            {userType === "existing_client" ? (
              <p className="mb-8 text-[14px] leading-6 text-[#6e655c]">
                Your account is pending approval by an administrator. You will be notified once access is granted.
              </p>
            ) : (
              <p className="mb-8 text-[14px] leading-6 text-[#6e655c]">
                Your email has been verified and your account is ready. You can now sign in.
              </p>
            )}
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c]"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea]">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[520px]">
          <div className="mb-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#9a8f83]">
              Property Project Marketing
            </p>
            <h1 className="mt-3 text-[2rem] font-medium tracking-tight text-[#2f2923] sm:text-[2.4rem]">
              Create an account
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6e655c]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2f2923] underline underline-offset-4 transition hover:text-[#b89464]">
                Sign in
              </Link>
            </p>
          </div>

          {/* ── Step: Role selection ─────────────────────────────────────── */}
          {step === "role" && (
            <div>
              <p className="mb-4 text-[13px] font-medium text-[#4d453d]">
                Select your role <span className="text-[#dc2626]">*</span>
              </p>

              <div className="space-y-3">
                {ROLE_OPTIONS.map((option) => {
                  const selected = userType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleSelect(option.value)}
                      className={[
                        "w-full rounded-xl border px-5 py-4 text-left transition",
                        selected
                          ? "border-[#2f2923] bg-[#2f2923] text-[#f4f1ea]"
                          : "border-[#c8bfb4] bg-[#fbfaf7] text-[#2f2923] hover:border-[#2f2923]",
                      ].join(" ")}
                    >
                      <p className={["text-[15px] font-medium", selected ? "text-[#f4f1ea]" : "text-[#2f2923]"].join(" ")}>
                        {option.label}
                      </p>
                      <p className={["mt-0.5 text-[13px]", selected ? "text-[#c8bfb4]" : "text-[#7a7166]"].join(" ")}>
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <FieldError msg={fieldErrors.userType} />

              <button
                type="button"
                onClick={handleRoleContinue}
                className="mt-6 w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c]"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step: Details form ───────────────────────────────────────── */}
          {step === "details" && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="mb-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("role"); setFieldErrors({}); setGeneralError(""); }}
                  className="flex items-center gap-1.5 text-[13px] text-[#7a7166] transition hover:text-[#2f2923]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <span className="text-[13px] text-[#7a7166]">—</span>
                <span className="text-[13px] font-medium text-[#2f2923]">
                  {ROLE_OPTIONS.find((r) => r.value === userType)?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                    First name <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value.replace(/[0-9]/g, "")); clearFieldError("firstName"); }}
                    className={getFieldClass(Boolean(fieldErrors.firstName))}
                  />
                  <FieldError msg={fieldErrors.firstName} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                    Last name <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value.replace(/[0-9]/g, "")); clearFieldError("lastName"); }}
                    className={getFieldClass(Boolean(fieldErrors.lastName))}
                  />
                  <FieldError msg={fieldErrors.lastName} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                  Email address <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  className={getFieldClass(Boolean(fieldErrors.email))}
                />
                <FieldError msg={fieldErrors.email} />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                  Password <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  className={getFieldClass(Boolean(fieldErrors.password))}
                />
                <FieldError msg={fieldErrors.password} />
                {!fieldErrors.password && (
                  <p className="mt-1.5 text-[12px] text-[#9a8f83]">
                    Min. 8 characters with uppercase, lowercase, number, and special character.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                  Confirm password <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                  className={getFieldClass(Boolean(fieldErrors.confirmPassword))}
                />
                <FieldError msg={fieldErrors.confirmPassword} />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                  Location <span className="text-[#dc2626]">*</span>
                </label>
                <div className="flex gap-3">
                  {(["local", "overseas"] as const).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => { setLocationKind(kind); setCity(""); clearFieldError("locationKind"); clearFieldError("city"); }}
                      className={[
                        "flex-1 rounded-xl border px-4 py-2.5 text-[14px] font-medium transition",
                        locationKind === kind
                          ? "border-[#2f2923] bg-[#2f2923] text-[#f4f1ea]"
                          : "border-[#c8bfb4] bg-[#fbfaf7] text-[#2f2923] hover:border-[#2f2923]",
                      ].join(" ")}
                    >
                      {kind === "local" ? "Local (Australia)" : "Overseas"}
                    </button>
                  ))}
                </div>
                <FieldError msg={fieldErrors.locationKind} />
              </div>

              {locationKind === "local" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                    City <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => { setCity(e.target.value); clearFieldError("city"); }}
                    className={getFieldClass(Boolean(fieldErrors.city))}
                  >
                    <option value="">Select your city</option>
                    {AUSTRALIAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <FieldError msg={fieldErrors.city} />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                  Phone number <span className="text-[12px] font-normal text-[#9a8f83]">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+61 4XX XXX XXX"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearFieldError("phone"); }}
                  className={getFieldClass(Boolean(fieldErrors.phone))}
                />
                <FieldError msg={fieldErrors.phone} />
              </div>

              {userType === "buyer_investor" && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                    I am purchasing as <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="flex gap-3">
                    {(["investor", "owner-occupier"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setClientType(type); clearFieldError("clientType"); }}
                        className={[
                          "flex-1 rounded-xl border px-4 py-2.5 text-[14px] font-medium transition",
                          clientType === type
                            ? "border-[#2f2923] bg-[#2f2923] text-[#f4f1ea]"
                            : "border-[#c8bfb4] bg-[#fbfaf7] text-[#2f2923] hover:border-[#2f2923]",
                        ].join(" ")}
                      >
                        {type === "investor" ? "Investor" : "Owner-Occupier"}
                      </button>
                    ))}
                  </div>
                  <FieldError msg={fieldErrors.clientType} />
                </div>
              )}

              {userType === "developer" && (
                <>
                  <div className="h-px bg-[#e8e0d8]" />
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a8f83]">
                    Developer details
                  </p>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                      Company name <span className="text-[12px] font-normal text-[#9a8f83]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Developments Pty Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={getFieldClass(false)}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                      ABN <span className="text-[12px] font-normal text-[#9a8f83]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="12 345 678 901"
                      value={abn}
                      onChange={(e) => { setAbn(e.target.value); clearFieldError("abn"); }}
                      className={getFieldClass(Boolean(fieldErrors.abn))}
                    />
                    <FieldError msg={fieldErrors.abn} />
                  </div>
                </>
              )}

              {generalError && Object.keys(fieldErrors).filter((k) => fieldErrors[k]).length === 0 && (
                <div className="rounded-xl border border-[#d4b7b0] bg-[#f7e9e6] px-4 py-3 text-[13px] text-[#8a3d31]">
                  {generalError}
                </div>
              )}

              {userType === "existing_client" && (
                <div className="rounded-xl border border-[#ddd5c8] bg-[#faf8f4] px-4 py-3 text-[13px] text-[#6e655c]">
                  Existing client accounts require administrator approval before you can sign in.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending code…" : "Create account"}
              </button>

              <p className="text-[12px] text-[#a49a8d]">
                By creating an account, you agree to our Terms of Use and Privacy Policy.
              </p>
            </form>
          )}

          {/* ── Step: Email verification ─────────────────────────────────── */}
          {step === "verify" && (
            <form onSubmit={handleVerifySubmit} noValidate className="space-y-6">
              <div className="mb-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("details"); setOtp(""); setOtpError(""); }}
                  className="flex items-center gap-1.5 text-[13px] text-[#7a7166] transition hover:text-[#2f2923]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              <div className="rounded-xl border border-[#ddd5c8] bg-white px-6 py-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f7ee]">
                  <svg className="h-6 w-6 text-[#4a9b5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-[#2f2923]">Check your email</p>
                <p className="mt-1.5 text-[13px] text-[#6e655c]">
                  We sent a 6-digit code to
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-[#2f2923] break-all">
                  {email}
                </p>
              </div>

              <div>
                <label className="mb-3 block text-center text-[13px] font-medium text-[#4d453d]">
                  Enter verification code
                </label>
                <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError(""); }} hasError={Boolean(otpError)} />
                {otpError && (
                  <p className="mt-3 text-center text-[13px] text-[#dc2626]">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingOtp || otp.replace(/\D/g, "").length < 6}
                className="w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingOtp ? "Creating account…" : "Verify & Create Account"}
              </button>

              <p className="text-center text-[13px] text-[#7a7166]">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="font-medium text-[#2f2923] underline underline-offset-4 transition hover:text-[#b89464] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </p>

              <p className="text-center text-[12px] text-[#a49a8d]">
                Code expires in 10 minutes.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
