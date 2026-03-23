"use client";

import { ChangeEvent, FormEvent, useState } from "react";

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
    <main className="min-h-screen w-full bg-[#efefef] text-[#1f2937]">
      <header className="flex flex-col gap-3 bg-[#dfe2e6] px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="text-[15px] font-bold text-[#2f2f2f]">
          Property Project Marketing Pty Ltd
        </div>

        <nav className="flex flex-wrap gap-3 text-[10px] font-medium text-[#334155] md:gap-4">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="#">Buyers</a>
          <a href="#">Services</a>
          <a href="#">Developers</a>
          <a href="#">Blog</a>
          <a href="#">Testimonials</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <section className="px-6 py-10">
        <h1 className="text-center text-[24px] font-bold text-[#2f3a4a]">
          CONTACT US
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-[760px] space-y-8"
        >
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name*"
              required
              className="w-full border-b border-[#b9c2d0] bg-transparent px-0 py-3 text-[13px] outline-none"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
              required
              className="w-full border-b border-[#b9c2d0] bg-transparent px-0 py-3 text-[13px] outline-none"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone*"
              required
              className="w-full border-b border-[#b9c2d0] bg-transparent px-0 py-3 text-[13px] outline-none"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <select
              name="propertyInterest"
              value={formData.propertyInterest}
              onChange={handleChange}
              required
              className="w-full border-b border-[#b9c2d0] bg-transparent px-0 py-3 text-[13px] outline-none"
            >
              <option value="">Property Interest*</option>
              <option value="off-plan">Off-plan</option>
              <option value="established">Established</option>
            </select>

            <select
              name="investorType"
              value={formData.investorType}
              onChange={handleChange}
              required
              className="w-full border-b border-[#b9c2d0] bg-transparent px-0 py-3 text-[13px] outline-none"
            >
              <option value="">Investor Type*</option>
              <option value="local">Local</option>
              <option value="overseas">Overseas</option>
            </select>
          </div>

          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Short Message"
              rows={6}
              className="w-full rounded-sm border border-[#b9c2d0] bg-transparent p-3 text-[13px] outline-none resize-none"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[180px] items-center justify-center bg-[#1f2937] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Send Enquiry"}
            </button>
          </div>

          {statusMessage && (
            <p
              className={`text-center text-[12px] ${
                isSuccess ? "text-green-700" : "text-red-600"
              }`}
            >
              {statusMessage}
            </p>
          )}
        </form>
      </section>

      <footer className="mt-8 bg-[#dfe2e6] px-4 py-4 text-center text-[11px] text-[#374151]">
        <p>© 2026 Property Project Marketing Pty Ltd</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#">fFacebook</a>
          <a href="#">𝕏Twitter</a>
          <a href="#">inLinkedIn</a>
        </div>
      </footer>
    </main>
  );
}