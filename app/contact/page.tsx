"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCountryCodes } from "./useCountryCodes";

type ContactFormData = {
  enquiryType: "general";
  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

const initialFormData: ContactFormData = {
  enquiryType: "general",
  name: "",
  email: "",
  phoneCountryCode: "",
  phone: "",
  message: "",
};

function ContactTabs() {
  return (
    <div className="bg-[#f6f2eb] pt-24 pb-6 flex flex-wrap justify-center gap-4 px-6">
      <Link
        href="/contact"
        className="min-w-[180px] border border-[#5f5245] bg-[#2f2a24] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-white"
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
        className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
      >
        Document Request
      </Link>
    </div>
  );
}

function getInputClass(hasError: boolean) {
  return `w-full border-b bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] ${
    hasError
      ? "border-[#dc2626] focus:border-[#dc2626]"
      : "border-[#cfc2b2] focus:border-[#5f5245]"
  }`;
}

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

function validateField(
  name: keyof ContactFormData,
  value: string
): FieldErrors[keyof ContactFormData] {
  const trimmedValue = value.trim();

  switch (name) {
    case "name":
      if (!trimmedValue) return "Enter your full name";
      if (value.length > 100) return "This field is too long";
      if (!NAME_REGEX.test(trimmedValue)) {
        return "Name can contain letters and spaces only";
      }
      return "";
    case "email":
      if (!trimmedValue) return "Enter your email address";
      if (value.length > 120) return "This field is too long";
      if (!EMAIL_REGEX.test(trimmedValue)) return "Enter a valid email address";
      return "";
    case "phoneCountryCode":
      if (!trimmedValue) return "Select a country code";
      if (value.length > 10) return "This field is too long";
      return "";
    case "phone": {
      if (!trimmedValue) return "Enter your phone number";
      if (value.length > 20) return "This field is too long";
      const normalizedPhone = normalizePhone(value);
      if (!PHONE_REGEX.test(normalizedPhone)) return "Enter a valid phone number";
      return "";
    }
    case "message":
      if (value.length > 1000) return "This field is too long";
      return "";
    case "enquiryType":
      return "";
    default:
      return "";
  }
}

function validateForm(formData: ContactFormData): FieldErrors {
  return {
    name: validateField("name", formData.name),
    email: validateField("email", formData.email),
    phoneCountryCode: validateField("phoneCountryCode", formData.phoneCountryCode),
    phone: validateField("phone", formData.phone),
    message: validateField("message", formData.message),
  };
}

export default function ContactPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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

  const { countries, defaultDialCode } = useCountryCodes("+61");

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
    const fieldName = name as keyof ContactFormData;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
        throw new Error(data.message || "Failed to submit form.");
      }

      setFeedbackModal({
        open: true,
        title: "Enquiry Submitted",
        message: "Your enquiry has been submitted successfully.",
        success: true,
      });
      setFormData({
        ...initialFormData,
        phoneCountryCode: defaultDialCode,
      });
      setFieldErrors({});
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setFeedbackModal({
        open: true,
        title: "Submission Failed",
        message,
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
            Get In Touch
          </p>
          <h1 className="mt-3 text-4xl font-light text-[#1f1a17] md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#6c6258]">
            General questions, partnership enquiries, or anything else not covered by
            our specialised forms can be sent here.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-12">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <div className="space-y-8">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  maxLength={100}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={getInputClass(Boolean(fieldErrors.name))}
                />
                {fieldErrors.name ? (
                  <p className="mt-3 text-[14px] text-[#dc2626]">{fieldErrors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Phone
                </label>
                <div className="grid grid-cols-[minmax(200px,260px)_1fr] gap-4">
                  <div>
                    <select
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.phoneCountryCode)}
                      className={getInputClass(Boolean(fieldErrors.phoneCountryCode))}
                      
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
                    {fieldErrors.phoneCountryCode ? (
                      <p className="mt-3 text-[14px] text-[#dc2626]">
                        {fieldErrors.phoneCountryCode}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      maxLength={15}
                      inputMode="numeric"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      className={getInputClass(Boolean(fieldErrors.phone))}
                    />
                    {fieldErrors.phone ? (
                      <p className="mt-3 text-[14px] text-[#dc2626]">{fieldErrors.phone}</p>
                    ) : null}
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
                  placeholder="Enter your email"
                  maxLength={120}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={getInputClass(Boolean(fieldErrors.email))}
                />
                {fieldErrors.email ? (
                  <p className="mt-3 text-[14px] text-[#dc2626]">{fieldErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us a little about what you're looking for"
                  rows={6}
                  maxLength={1000}
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={[
                    "w-full rounded-sm bg-[#fdfbf8] p-4 text-[14px] text-[#1f1a17] outline-none resize-none transition placeholder:text-[#9c9186]",
                    fieldErrors.message
                      ? "border border-[#dc2626] focus:border-[#dc2626]"
                      : "border border-[#d9cec0] focus:border-[#5f5245]",
                  ].join(" ")}
                />
                {fieldErrors.message ? (
                  <p className="mt-3 text-[14px] text-[#dc2626]">{fieldErrors.message}</p>
                ) : null}
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