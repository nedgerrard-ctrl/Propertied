"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type DeveloperFormData = {
  enquiryType: "developer";
  name: string;
  email: string;
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
  phone: "",
  projectName: "",
  projectLocation: "",
  commissionStructureInterest: "",
  message: "",
};

export default function DevelopersContactPage() {
  const [formData, setFormData] = useState<DeveloperFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatusMessage("");
    setIsSuccess(false);

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
        throw new Error(data.message || "Failed to submit form.");
      }

      setIsSuccess(true);
      setStatusMessage("Your developer enquiry has been submitted successfully.");
      setFormData(initialFormData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setIsSuccess(false);
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <Navbar />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
    <a
        href="/contact"
         className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] hover:border-[#5f5245] hover:text-[#1f1a17]"
    >
        General Enquiry
    </a>

    <a
        href="/contact/buyers-investors"
        className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] hover:border-[#5f5245] hover:text-[#1f1a17]"
    >
        Buyers / Investors
    </a>

    <a
        href="/contact/developers"
         className="min-w-[180px] border border-[#5f5245] bg-[#2f2a24] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-white"
    >
        Developers
    </a>
    </div>
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
            <div className="grid gap-8 md:grid-cols-2">
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
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
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
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
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
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] outline-none"
                />
              </div>
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
                className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] p-4 text-[14px] outline-none resize-none"
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[200px] items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17] disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Send Enquiry"}
              </button>
            </div>

            {statusMessage && (
              <p className={`text-center text-[13px] ${isSuccess ? "text-green-700" : "text-red-600"}`}>
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}