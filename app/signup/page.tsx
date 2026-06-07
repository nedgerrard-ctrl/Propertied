"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { isValidPassword } from "@/lib/password-validation";
import { useCountryCodes } from "../contact/useCountryCodes";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// After stripping all non-digits: starts with 61 (international) or 0 (local), second area digit 2–9, then 8 more
const AU_PHONE_REGEX = /^(61|0)[2-9]\d{8}$/;
// Overseas: digits only, 6–15 digits (country code entered via dropdown)
const OVERSEAS_PHONE_REGEX = /^[0-9]{6,15}$/;

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

function getCountrySelectClass(hasError: boolean) {
  return [
    "flex-shrink-0 w-40 rounded-xl bg-[#fbfaf7] px-3 py-3 text-[14px] text-[#2f2923] outline-none transition",
    hasError
      ? "border border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10"
      : "border border-[#c8bfb4] focus:border-[#2f2923] focus:ring-2 focus:ring-[#2f2923]/10",
  ].join(" ");
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-[13px] text-[#dc2626]">{msg}</p>;
}

function validateForm(values: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  phoneCountryCode: string;
  locationKind: string;
  city: string;
  clientType: string;
  abn: string;
  userType: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(values.password)) {
    errors.password = "Password does not meet the requirements below.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.locationKind) {
    errors.locationKind = "Please select your location.";
  } else if (values.locationKind === "local" && !values.city.trim()) {
    errors.city = "Please select your city.";
  }

  // Phone is optional; format depends on location
  const phoneTrimmed = values.phone.trim();
  if (phoneTrimmed) {
    if (values.locationKind === "local") {
      const stripped = phoneTrimmed.replace(/\D/g, "");
      if (!AU_PHONE_REGEX.test(stripped)) {
        errors.phone = "Please enter a valid Australian phone number (e.g. 0412 345 678).";
      }
    } else if (values.locationKind === "overseas") {
      const stripped = phoneTrimmed.replace(/\D/g, "");
      if (!OVERSEAS_PHONE_REGEX.test(stripped)) {
        errors.phone = "Please enter a valid phone number (digits only, 6–15 digits).";
      }
      if (!values.phoneCountryCode) {
        errors.phoneCountryCode = "Please select a country code.";
      }
    }
  }

  if (values.userType === "buyer_investor" && !values.clientType) {
    errors.clientType = "Please select whether you are an investor or owner-occupier.";
  }

  if (values.userType === "developer" && values.abn.trim()) {
    if (!/^\d{11}$/.test(values.abn.replace(/\s/g, ""))) {
      errors.abn = "ABN must be 11 digits.";
    }
  }

  return errors;
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

// ─── Password Strength Hints ───────────────────────────────────────────────────

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
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
  const [locationKind, setLocationKind] = useState<"local" | "overseas" | "">("");
  const [city, setCity] = useState("");
  const [clientType, setClientType] = useState<"investor" | "owner-occupier" | "">("");
  const [companyName, setCompanyName] = useState("");
  const [abn, setAbn] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // OTP step state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [submittingOtp, setSubmittingOtp] = useState(false);

  // Server-side phone uniqueness check
  const [phoneServerError, setPhoneServerError] = useState("");
  const [checkingPhone, setCheckingPhone] = useState(false);

  const { countries } = useCountryCodes();

  // Compute all client-side errors from current state
  const formErrors = useMemo(
    () =>
      validateForm({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        phoneCountryCode,
        locationKind,
        city,
        clientType,
        abn,
        userType: userType as string,
      }),
    [firstName, lastName, email, password, confirmPassword, phone, phoneCountryCode, locationKind, city, clientType, abn, userType]
  );

  const formIsValid = Object.keys(formErrors).length === 0;

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleBlur(field: string) {
    markTouched(field);
    setFieldErrors((prev) => ({ ...prev, [field]: formErrors[field] ?? "" }));
  }

  // Re-validate a field on change only after it has been touched, using new value
  function handleChangedField(field: string, newValue: string) {
    if (!touched[field]) return;
    const errors = validateForm({
      firstName: field === "firstName" ? newValue : firstName,
      lastName: field === "lastName" ? newValue : lastName,
      email: field === "email" ? newValue : email,
      password: field === "password" ? newValue : password,
      confirmPassword: field === "confirmPassword" ? newValue : confirmPassword,
      phone: field === "phone" ? newValue : phone,
      phoneCountryCode: field === "phoneCountryCode" ? newValue : phoneCountryCode,
      locationKind: field === "locationKind" ? newValue : locationKind,
      city: field === "city" ? newValue : city,
      clientType: field === "clientType" ? newValue : clientType,
      abn: field === "abn" ? newValue : abn,
      userType: userType as string,
    });
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] ?? "" }));
  }

  // When password changes, also re-validate confirmPassword if it has been touched
  function handlePasswordChange(newVal: string) {
    setPassword(newVal);
    if (touched.password || touched.confirmPassword) {
      const errors = validateForm({
        firstName, lastName, email,
        password: newVal,
        confirmPassword,
        phone, phoneCountryCode, locationKind, city, clientType, abn,
        userType: userType as string,
      });
      setFieldErrors((prev) => ({
        ...prev,
        ...(touched.password ? { password: errors.password ?? "" } : {}),
        ...(touched.confirmPassword ? { confirmPassword: errors.confirmPassword ?? "" } : {}),
      }));
    }
  }

  async function runPhoneServerCheck(overridePhone?: string, overrideCode?: string) {
    const phoneTrimmed = (overridePhone ?? phone).trim();
    if (!phoneTrimmed) return;

    const code = overrideCode ?? phoneCountryCode;
    const combined =
      locationKind === "overseas" && code
        ? `${code}${phoneTrimmed}`
        : phoneTrimmed;

    setCheckingPhone(true);
    try {
      const res = await fetch("/api/auth/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: combined }),
      });
      if (res.status === 409) {
        setPhoneServerError("This phone number is already registered.");
        setFieldErrors((prev) => ({ ...prev, phone: "This phone number is already registered." }));
      }
    } catch {
      // silently fail — server will re-validate on final submit
    } finally {
      setCheckingPhone(false);
    }
  }

  async function handlePhoneBlur() {
    markTouched("phone");
    const formatError = formErrors.phone ?? "";
    setFieldErrors((prev) => ({ ...prev, phone: formatError }));
    // Only run the server check when the format is already valid
    if (!formatError && phone.trim()) {
      await runPhoneServerCheck();
    }
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

    // Run full client-side validation
    const allErrors = validateForm({
      firstName, lastName, email, password, confirmPassword,
      phone, phoneCountryCode, locationKind, city, clientType, abn,
      userType: userType as string,
    });

    // Mark every field as touched so all errors become visible
    setTouched({
      firstName: true, lastName: true, email: true, password: true,
      confirmPassword: true, phone: true, phoneCountryCode: true,
      locationKind: true, city: true, clientType: true, abn: true,
    });

    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      setGeneralError("Please correct the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setPhoneServerError("");
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

    // Combine country code + number for overseas users
    const combinedPhone =
      locationKind === "overseas" && phone.trim()
        ? `${phoneCountryCode}${phone.trim()}`
        : phone.trim();

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
          phone: combinedPhone,
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
            <p className="mt-1.5 text-[14px] leading-6 text-[#6e655c]">
              Get exclusive access to property listings, reports, and project updates.
            </p>
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
                  onClick={() => { setStep("role"); setFieldErrors({}); setGeneralError(""); setTouched({}); }}
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
                    onChange={(e) => {
                      const val = e.target.value.replace(/[0-9]/g, "");
                      setFirstName(val);
                      handleChangedField("firstName", val);
                    }}
                    onBlur={() => handleBlur("firstName")}
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
                    onChange={(e) => {
                      const val = e.target.value.replace(/[0-9]/g, "");
                      setLastName(val);
                      handleChangedField("lastName", val);
                    }}
                    onBlur={() => handleBlur("lastName")}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleChangedField("email", e.target.value);
                  }}
                  onBlur={() => handleBlur("email")}
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => { setPasswordFocused(false); handleBlur("password"); }}
                  className={getFieldClass(Boolean(fieldErrors.password))}
                />
                <FieldError msg={fieldErrors.password} />
                {(passwordFocused || password.length > 0) && (
                  <PasswordStrengthHints password={password} />
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    handleChangedField("confirmPassword", e.target.value);
                  }}
                  onBlur={() => handleBlur("confirmPassword")}
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
                      onClick={() => {
                        setLocationKind(kind);
                        setCity("");
                        setPhone("");
                        setPhoneCountryCode("");
                        setPhoneServerError("");
                        setTouched((prev) => ({
                          ...prev,
                          locationKind: true,
                          city: false,
                          phone: false,
                          phoneCountryCode: false,
                        }));
                        setFieldErrors((prev) => ({
                          ...prev,
                          locationKind: "",
                          city: "",
                          phone: "",
                          phoneCountryCode: "",
                        }));
                      }}
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
                    onChange={(e) => {
                      setCity(e.target.value);
                      handleChangedField("city", e.target.value);
                    }}
                    onBlur={() => handleBlur("city")}
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

              {/* ── Phone number ─────────────────────────────────────────── */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#4d453d]">
                  Phone number{" "}
                  <span className="text-[12px] font-normal text-[#9a8f83]">(optional)</span>
                </label>

                {locationKind === "overseas" ? (
                  /* Overseas: country code dropdown + number input */
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhoneCountryCode(val);
                        setPhoneServerError("");
                        setTouched((prev) => ({ ...prev, phoneCountryCode: true }));
                        setFieldErrors((prev) => ({
                          ...prev,
                          phoneCountryCode: !val && phone.trim() ? "Please select a country code." : "",
                        }));
                      }}
                      onBlur={async () => {
                        handleBlur("phoneCountryCode");
                        // Re-run server check if phone is already valid and a code is now selected
                        if (phoneCountryCode && phone.trim() && !formErrors.phone) {
                          await runPhoneServerCheck(phone, phoneCountryCode);
                        }
                      }}
                      className={getCountrySelectClass(Boolean(fieldErrors.phoneCountryCode))}
                    >
                      <option value="">Country</option>
                      {countries.map((country) => (
                        <option
                          key={`${country.code}-${country.dialCode}`}
                          value={country.dialCode}
                        >
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      inputMode="numeric"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhone(val);
                        setPhoneServerError("");
                        handleChangedField("phone", val);
                      }}
                      onBlur={handlePhoneBlur}
                      className={getFieldClass(Boolean(fieldErrors.phone || phoneServerError))}
                    />
                  </div>
                ) : (
                  /* Local (Australia) or not yet selected: plain input */
                  <input
                    type="tel"
                    placeholder="0412 345 678"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setPhone(val);
                      setPhoneServerError("");
                      handleChangedField("phone", val);
                    }}
                    onBlur={handlePhoneBlur}
                    className={getFieldClass(Boolean(fieldErrors.phone || phoneServerError))}
                  />
                )}

                {/* Show country code error, then phone format/server error */}
                <FieldError msg={fieldErrors.phoneCountryCode || fieldErrors.phone || phoneServerError} />
                {checkingPhone && (
                  <p className="mt-1.5 text-[12px] text-[#9a8f83]">Checking availability…</p>
                )}

                {/* Format hint for local, only when no error */}
                {locationKind === "local" && !fieldErrors.phone && (
                  <p className="mt-1.5 text-[12px] text-[#9a8f83]">
                    Australian format, e.g. 0412 345 678 or 02 9876 5432
                  </p>
                )}
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
                        onClick={() => {
                          setClientType(type);
                          setTouched((prev) => ({ ...prev, clientType: true }));
                          setFieldErrors((prev) => ({ ...prev, clientType: "" }));
                        }}
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
                      onChange={(e) => {
                        setAbn(e.target.value);
                        handleChangedField("abn", e.target.value);
                      }}
                      onBlur={() => handleBlur("abn")}
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
                disabled={!formIsValid || Boolean(phoneServerError) || checkingPhone || loading}
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
