"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;

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

const initialFormData: DeveloperFormData = {
  enquiryType: "developer",
  name: "",
  email: "",
  phoneCountryCode: "+61",
  phone: "",
  projectName: "",
  projectLocation: "",
  commissionStructureInterest: "",
  message: "",
};

function ContactTabs() {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
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

export default function DevelopersContactPage() {
  const [formData, setFormData] = useState<DeveloperFormData>(initialFormData);
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

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const normalizedPhone = formData.phone.replace(/\s|-/g, "").trim();

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setFeedbackModal({
        open: true,
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        success: false,
      });
      setLoading(false);
      return;
    }

    if (!PHONE_REGEX.test(normalizedPhone)) {
      setFeedbackModal({
        open: true,
        title: "Invalid Phone Number",
        message: "Please enter a valid phone number.",
        success: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: normalizedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form.");
      }

      setFeedbackModal({
        open: true,
        title: "Enquiry Submitted",
        message: "Your developer enquiry has been submitted successfully.",
        success: true,
      });
      setFormData(initialFormData);
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
      <Navbar />
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
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  required
                  maxLength={100}
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Phone
                </label>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-4">
                  <select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                  >
                    <option value="+61">+61</option>
                    <option value="+65">+65</option>
                    <option value="+44">+44</option>
                    <option value="+1">+1</option>
                    <option value="+86">+86</option>
                    <option value="+64">+64</option>
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    maxLength={15}
                    inputMode="numeric"
                    pattern="[0-9\s-]+"
                    className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                  />
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
                  required
                  maxLength={120}
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
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
                  required
                  maxLength={120}
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
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
                  required
                  maxLength={120}
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
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
                  placeholder="e.g. project marketing / sales representation"
                  required
                  maxLength={150}
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us more about your project or requirements"
                  maxLength={1000}
                  className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] p-4 text-[14px] outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[220px] items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17] disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Send Enquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${
                feedbackModal.success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedbackModal.success ? "✓" : "!"}
            </div>

            <h3 className="text-xl font-medium text-[#1f1a17]">
              {feedbackModal.title}
            </h3>

            <p className="mt-3 text-[14px] leading-7 text-[#6c6258]">
              {feedbackModal.message}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setFeedbackModal((prev) => ({
                    ...prev,
                    open: false,
                  }))
                }
                className="inline-flex min-w-[120px] items-center justify-center rounded-sm bg-[#2f2a24] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}