"use client";

import { useState } from "react";
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
    label: "Buyer / Investor",
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

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<"role" | "details">("role");
  const [userType, setUserType] = useState<UserType | "">("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [locationKind, setLocationKind] = useState<"local" | "overseas" | "">("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [abn, setAbn] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleRoleSelect(role: UserType) {
    setUserType(role);
    setFieldErrors({});
  }

  function handleRoleContinue() {
    if (!userType) {
      setFieldErrors({ userType: "Please select a role to continue." });
      return;
    }
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setLoading(true);

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
          phone,
          locationKind,
          city,
          companyName,
          abn,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setGeneralError(data.message || "Please correct the highlighted fields.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setGeneralError("Something went wrong. Please try again.");
      setLoading(false);
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
                Your account has been created successfully. You can now sign in to access your portal.
              </p>
            )}
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-[#2f2923] px-4 py-3.5 text-[15px] font-medium text-[#f4f1ea] transition hover:bg-[#3d342c]"
            >
              Click here to login
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
                    onChange={(e) => { setFirstName(e.target.value); clearFieldError("firstName"); }}
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
                    onChange={(e) => { setLastName(e.target.value); clearFieldError("lastName"); }}
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

              {generalError && Object.keys(fieldErrors).length === 0 && (
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
                {loading ? "Creating account…" : "Create account"}
              </button>

              <p className="text-[12px] text-[#a49a8d]">
                By creating an account, you agree to our Terms of Use and Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
