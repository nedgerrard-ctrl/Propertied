"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  investorType: string;
  message: string;
};

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  propertyInterest: "",
  investorType: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      setStatusMessage("Your enquiry has been submitted successfully.");
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

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Get In Touch
          </p>
          <h1 className="mt-3 text-4xl font-light text-[#1f1a17] md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#6c6258]">
            Speak with our team about buying opportunities, project marketing,
            or tailored property advice.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
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
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
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
                  placeholder="Enter your phone number"
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
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
                  placeholder="Enter your email"
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Property Interest
                </label>
                <select
                  name="propertyInterest"
                  value={formData.propertyInterest}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition focus:border-[#5f5245]"
                >
                  <option value="">Select property interest</option>
                  <option value="off-plan">Off-plan</option>
                  <option value="established">Established</option>
                </select>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Investor Type
                </label>
                <select
                  name="investorType"
                  value={formData.investorType}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition focus:border-[#5f5245]"
                >
                  <option value="">Select investor type</option>
                  <option value="local">Local</option>
                  <option value="overseas">Overseas</option>
                </select>
              </div>

              <div className="hidden md:block" />
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
                className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] p-4 text-[14px] text-[#1f1a17] outline-none resize-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[200px] items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Send Enquiry"}
              </button>
            </div>

            {statusMessage && (
              <p
                className={`text-center text-[13px] ${
                  isSuccess ? "text-green-700" : "text-red-600"
                }`}
              >
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