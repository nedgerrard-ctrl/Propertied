"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCountryCodes } from "../useCountryCodes";

type EnquiryCategory = "sales" | "portfolio" | "developers" | "general" | "";

type DocumentRequestFormData = {
  category: EnquiryCategory;
  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  documentsRequested: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof DocumentRequestFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

const CATEGORY_OPTIONS: { label: string; value: EnquiryCategory }[] = [
  { label: "Sales Enquiries", value: "sales" },
  { label: "Portfolio Management", value: "portfolio" },
  { label: "Developers", value: "developers" },
  { label: "General", value: "general" },
];

const initialFormData: DocumentRequestFormData = {
  category: "",
  name: "",
  email: "",
  phoneCountryCode: "",
  phone: "",
  documentsRequested: "",
  message: "",
};

function ContactTabs() {
  return (
    <div className="bg-[#f6f2eb] pt-24 pb-6 flex flex-wrap justify-center gap-4 px-6">
      <Link
        href="/contact"
        className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
      >
        General Enquiry
      </Link>

      <Link
        href="/contact/buyers-investors"
        className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
      >
        Buyers
      </Link>

      <Link
        href="/contact/developers"
        className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
      >
        Developers
      </Link>

      <Link
        href="/contact/document-request"
        className="min-w-[180px] border border-[#5f5245] bg-[#2f2a24] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-white"
      >
        Document Request
      </Link>
    </div>
  );
}

function getUnderlineInputClass(hasError: boolean) {
  return `w-full border-b bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] ${
    hasError
      ? "border-[#dc2626] focus:border-[#dc2626]"
      : "border-[#cfc2b2] focus:border-[#5f5245]"
  }`;
}

function getTextareaClass(hasError: boolean) {
  return `w-full rounded-sm border bg-[#fdfbf8] px-4 py-4 text-[14px] leading-7 text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] resize-none ${
    hasError
      ? "border-[#dc2626] focus:border-[#dc2626]"
      : "border-[#d9cec0] focus:border-[#5f5245]"
  }`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-3 text-[14px] text-[#dc2626]">{message}</p>;
}

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

function validateField(
  name: keyof DocumentRequestFormData,
  value: string
): string {
  const trimmed = value.trim();

  switch (name) {
    case "category":
      return trimmed ? "" : "Select an enquiry category";
    case "name":
      if (!trimmed) return "Enter your full name";
      if (value.length > 100) return "This field is too long";
      if (!NAME_REGEX.test(trimmed)) return "Name can contain letters and spaces only";
      return "";
    case "email":
      if (!trimmed) return "Enter your email address";
      if (value.length > 120) return "This field is too long";
      if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
      return "";
    case "phoneCountryCode":
      return trimmed ? "" : "Select a country code";
    case "phone": {
      if (!trimmed) return "Enter your phone number";
      if (value.length > 20) return "This field is too long";
      if (!PHONE_REGEX.test(normalizePhone(value))) return "Enter a valid phone number";
      return "";
    }
    case "documentsRequested":
      if (!trimmed) return "Describe the documents you are requesting";
      if (value.length > 1000) return "This field is too long";
      return "";
    case "message":
      if (value.length > 1000) return "This field is too long";
      return "";
    default:
      return "";
  }
}

function validateForm(formData: DocumentRequestFormData): FieldErrors {
  return {
    category: validateField("category", formData.category),
    name: validateField("name", formData.name),
    email: validateField("email", formData.email),
    phoneCountryCode: validateField("phoneCountryCode", formData.phoneCountryCode),
    phone: validateField("phone", formData.phone),
    documentsRequested: validateField("documentsRequested", formData.documentsRequested),
    message: validateField("message", formData.message),
  };
}

export default function DocumentRequestPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<DocumentRequestFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    success: boolean;
  }>({ open: false, title: "", message: "", success: false });

  const { countries, defaultDialCode } = useCountryCodes("+61");

  useEffect(() => {
    setFormData((prev) =>
      prev.phoneCountryCode ? prev : { ...prev, phoneCountryCode: defaultDialCode }
    );
  }, [defaultDialCode]);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    const fieldName = name as keyof DocumentRequestFormData;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      setFeedbackModal({
        open: true,
        title: "Submission Failed",
        message: "Please correct the highlighted fields.",
        success: false,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact/document-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setFeedbackModal({
          open: true,
          title: "Submission Failed",
          message: data.message || "Please correct the highlighted fields.",
          success: false,
        });
        return;
      }

      setFeedbackModal({
        open: true,
        title: "Request Submitted",
        message: "Your document request has been submitted. Our team will be in touch shortly.",
        success: true,
      });
      setFormData({ ...initialFormData, phoneCountryCode: defaultDialCode });
      setFieldErrors({});
    } catch {
      setFeedbackModal({
        open: true,
        title: "Submission Failed",
        message: "Something went wrong. Please try again.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <Navbar blackBg />
      <ContactTabs />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Document Request
          </p>
          <h1 className="mt-3 text-4xl font-light text-[#1f1a17] md:text-5xl">
            Request Documents
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#6c6258]">
            Select the relevant category and tell us which documents you need.
            Our team will respond as soon as possible.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-12">
          <form onSubmit={handleSubmit} noValidate className="space-y-10">

            {/* Category */}
            <div>
              <label className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                Enquiry Category
              </label>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {CATEGORY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer border px-4 py-4 flex items-center justify-center text-center text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                      formData.category === option.value
                        ? "border-[#5f5245] bg-[#2f2a24] text-white"
                        : "border-[#d9cec0] bg-[#fdfbf8] text-[#5b5147] hover:border-[#5f5245]"
                    } ${fieldErrors.category ? "ring-1 ring-[#dc2626]" : ""}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      checked={formData.category === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <FieldError message={fieldErrors.category} />

              {formData.category && (
                <p className="mt-4 text-[13px] text-[#8a7b6d]">
                  {formData.category === "sales" &&
                    "Your request will be directed to our sales team."}
                  {formData.category === "portfolio" &&
                    "Your request will be directed to our portfolio management team."}
                  {formData.category === "developers" &&
                    "Your request will be directed to our development team."}
                  {formData.category === "general" &&
                    "Your request will be directed to our admin team."}
                </p>
              )}
            </div>

            <div className="border-t border-[#e3d8ca] pt-10 space-y-8">
              <div>
                <h2 className="text-2xl font-light text-[#1f1a17]">
                  Contact Details
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6c6258]">
                  Provide your contact information so our team can follow up on your request.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  maxLength={100}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={getUnderlineInputClass(Boolean(fieldErrors.name))}
                />
                <FieldError message={fieldErrors.name} />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Phone
                </label>
                <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-4">
                  <div>
                    <select
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.phoneCountryCode)}
                      className={getUnderlineInputClass(Boolean(fieldErrors.phoneCountryCode))}
                    >
                      <option value="">Select code</option>
                      {countries.map((country) => (
                        <option
                          key={`${country.code}-${country.dialCode}`}
                          value={country.dialCode}
                        >
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.phoneCountryCode} />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      maxLength={20}
                      inputMode="numeric"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      className={getUnderlineInputClass(Boolean(fieldErrors.phone))}
                    />
                    <FieldError message={fieldErrors.phone} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  maxLength={120}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={getUnderlineInputClass(Boolean(fieldErrors.email))}
                />
                <FieldError message={fieldErrors.email} />
              </div>
            </div>

            <div className="border-t border-[#e3d8ca] pt-10 space-y-8">
              <div>
                <h2 className="text-2xl font-light text-[#1f1a17]">
                  Document Details
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6c6258]">
                  Tell us which documents you need and any additional context that may help us process your request.
                </p>
              </div>

              {/* Documents Requested */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Documents Requested
                </label>
                <textarea
                  name="documentsRequested"
                  value={formData.documentsRequested}
                  onChange={handleChange}
                  placeholder="Please describe the documents you are requesting (e.g. contract of sale, disclosure statement, rental agreement, etc.)"
                  rows={5}
                  maxLength={1000}
                  aria-invalid={Boolean(fieldErrors.documentsRequested)}
                  className={getTextareaClass(Boolean(fieldErrors.documentsRequested))}
                />
                <FieldError message={fieldErrors.documentsRequested} />
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Additional Information{" "}
                  <span className="text-[#9c9186] normal-case tracking-normal font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any additional context that may help us process your request"
                  rows={4}
                  maxLength={1000}
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={getTextareaClass(Boolean(fieldErrors.message))}
                />
                <FieldError message={fieldErrors.message} />
              </div>
            </div>

            <div className="border-t border-[#e3d8ca] pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm bg-[#2f2a24] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f1a17] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />

      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-sm bg-white p-8 text-center shadow-2xl">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                feedbackModal.success ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {feedbackModal.success ? (
                <svg viewBox="0 0 20 20" className="h-7 w-7 fill-emerald-600">
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.312a1 1 0 0 1-1.42-.003l-3.75-3.812a1 1 0 1 1 1.425-1.404l3.04 3.09 6.54-6.597a1 1 0 0 1 1.41 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-7 w-7 fill-red-600">
                  <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.53-10.97a.75.75 0 0 0-1.06-1.06L10 8.44 7.53 5.97a.75.75 0 0 0-1.06 1.06L8.94 9.5l-2.47 2.47a.75.75 0 1 0 1.06 1.06L10 10.56l2.47 2.47a.75.75 0 0 0 1.06-1.06L11.06 9.5l2.47-2.47Z" />
                </svg>
              )}
            </div>
            <h3 className="mt-5 text-2xl font-light text-[#1f1a17]">
              {feedbackModal.title}
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-[#6c6258]">
              {feedbackModal.message}
            </p>
            <button
              onClick={() => setFeedbackModal((prev) => ({ ...prev, open: false }))}
              className="mt-8 w-full rounded-sm bg-[#2f2a24] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
