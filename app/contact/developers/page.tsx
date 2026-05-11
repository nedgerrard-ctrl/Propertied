"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCountryCodes } from "../useCountryCodes";

type DeveloperFormData = {
  enquiryType: "developer";
  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  projectName: string;
  projectLocation: string;
  commissionStructureInterest: string;
  message: string;
};

type DeveloperFieldErrors = Partial<Record<keyof DeveloperFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

const initialFormData: DeveloperFormData = {
  enquiryType: "developer",
  name: "",
  email: "",
  phoneCountryCode: "",
  phone: "",
  projectName: "",
  projectLocation: "",
  commissionStructureInterest: "",
  message: "",
};

function ContactTabs() {
  return (
    <div className="mt-24 flex flex-wrap justify-center gap-4 px-6">
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
        Buyers / Investors
      </Link>

      <Link
        href="/contact/developers"
        className="min-w-[180px] border border-[#5f5245] bg-[#2f2a24] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-white"
      >
        Developers
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

function getSelectInputClass(hasError: boolean) {
  return `w-full border-b bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition ${
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
  name: keyof DeveloperFormData,
  value: string
): DeveloperFieldErrors[keyof DeveloperFormData] {
  const trimmedValue = value.trim();

  switch (name) {
    case "name":
  if (!trimmedValue) return "Enter your full name";
  if (value.length > 100) return "This field is too long";
  if (!NAME_REGEX.test(trimmedValue)) return "Name can contain letters and spaces only";
  return "";
    case "email":
      if (!trimmedValue) return "Enter your email address";
      if (value.length > 120) return "This field is too long";
      if (!EMAIL_REGEX.test(trimmedValue)) return "Enter a valid email address";
      return "";
    case "phoneCountryCode":
      if (!trimmedValue) return "Select a country code";
      if (value.length > 6) return "This field is too long";
      return "";
    case "phone": {
      if (!trimmedValue) return "Enter your phone number";
      if (value.length > 20) return "This field is too long";
      const normalizedPhone = normalizePhone(value);
      if (!PHONE_REGEX.test(normalizedPhone)) return "Enter a valid phone number";
      return "";
    }
    case "projectName":
      if (!trimmedValue) return "Enter the project name";
      if (value.length > 120) return "This field is too long";
      return "";
    case "projectLocation":
      if (!trimmedValue) return "Enter the project location";
      if (value.length > 120) return "This field is too long";
      return "";
    case "commissionStructureInterest":
      if (!trimmedValue) return "Enter your commission structure interest";
      if (value.length > 150) return "This field is too long";
      return "";
    case "message":
      if (value.length > 1000) return "This field is too long";
      return "";
    case "enquiryType":
      return "";
    default:
      return "";
  }
}

function validateForm(formData: DeveloperFormData): DeveloperFieldErrors {
  return {
    name: validateField("name", formData.name),
    email: validateField("email", formData.email),
    phoneCountryCode: validateField("phoneCountryCode", formData.phoneCountryCode),
    phone: validateField("phone", formData.phone),
    projectName: validateField("projectName", formData.projectName),
    projectLocation: validateField("projectLocation", formData.projectLocation),
    commissionStructureInterest: validateField(
      "commissionStructureInterest",
      formData.commissionStructureInterest
    ),
    message: validateField("message", formData.message),
  };
}

export default function DevelopersContactPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<DeveloperFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<DeveloperFieldErrors>({});

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);
  const [loading, setLoading] = useState(false);
  const { countries, defaultDialCode } = useCountryCodes("+61");
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    success: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    success: false,
  });
  useEffect(() => {
  setFormData((prev) =>
    prev.phoneCountryCode
      ? prev
      : {
          ...prev,
          phoneCountryCode: defaultDialCode,
        }
  );
}, [defaultDialCode]);
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    const fieldName = name as keyof DeveloperFormData;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userType = session?.user?.userType;

    if (userType === "buyer_investor" || userType === "existing_client") {
      setFeedbackModal({
        open: true,
        title: "Not Allowed",
        message:
          userType === "buyer_investor"
            ? "As a buyer or investor, please use the Buyers / Investors enquiry form."
            : "As an existing client, you are not permitted to submit developer enquiries.",
        success: false,
      });
      return;
    }

    const validationErrors = validateForm(formData);
    setFieldErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        title: "Enquiry Submitted",
        message: "Your developer enquiry has been submitted successfully.",
        success: true,
      });
      setFormData({
  ...initialFormData,
  phoneCountryCode: defaultDialCode,
});
      setFieldErrors({});
    } catch {
      setFeedbackModal({
        open: true,
        title: "Submission Failed",
        message: "Something went wrong.",
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
            For Developers
          </p>
          <h1 className="mt-3 text-4xl font-light text-[#1f1a17] md:text-5xl">
            Developer Enquiry Form
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#6c6258]">
            Speak with PPM about project representation and commission-based
            collaboration.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-12">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <div className="space-y-8">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Contact Name
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
                      className={getSelectInputClass(Boolean(fieldErrors.phoneCountryCode))}
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

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter the project name"
                  maxLength={120}
                  aria-invalid={Boolean(fieldErrors.projectName)}
                  className={getUnderlineInputClass(Boolean(fieldErrors.projectName))}
                />
                <FieldError message={fieldErrors.projectName} />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Project Location
                </label>
                <input
                  type="text"
                  name="projectLocation"
                  value={formData.projectLocation}
                  onChange={handleChange}
                  placeholder="Enter the project location"
                  maxLength={120}
                  aria-invalid={Boolean(fieldErrors.projectLocation)}
                  className={getUnderlineInputClass(Boolean(fieldErrors.projectLocation))}
                />
                <FieldError message={fieldErrors.projectLocation} />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Commission Structure Interest
                </label>
                <input
                  type="text"
                  name="commissionStructureInterest"
                  value={formData.commissionStructureInterest}
                  onChange={handleChange}
                  placeholder="Tell us about the commission structure"
                  maxLength={150}
                  aria-invalid={Boolean(fieldErrors.commissionStructureInterest)}
                  className={getUnderlineInputClass(
                    Boolean(fieldErrors.commissionStructureInterest)
                  )}
                />
                <FieldError message={fieldErrors.commissionStructureInterest} />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share any important details about the project or partnership"
                  rows={6}
                  maxLength={1000}
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={getTextareaClass(Boolean(fieldErrors.message))}
                />
                <FieldError message={fieldErrors.message} />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[220px] items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {feedbackModal.open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-6">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium text-[#1f1a17]">
              {feedbackModal.title}
            </h3>
            <p className="mt-3 text-[14px] leading-6 text-[#6c6258]">
              {feedbackModal.message}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  setFeedbackModal({
                    open: false,
                    title: "",
                    message: "",
                    success: false,
                  })
                }
                className="rounded-sm bg-[#2f2a24] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </main>
  );
}