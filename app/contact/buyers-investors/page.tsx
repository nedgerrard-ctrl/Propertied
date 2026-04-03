"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type BuyerFormData = {
  enquiryType: "buyer";
  buyerType: "owner-occupier" | "investor" | "";
  investorRegion: "local" | "overseas" | "";
  name: string;
  email: string;
  phone: string;
  minBudget: string;
  maxBudget: string;
  preferredLocations: string;
  propertyInterest: "off-plan" | "established" | "";
  bedrooms: string;
  bedroomRange: boolean;
  bathrooms: string;
  carSpaces: string;
  minLandSize: string;
  maxLandSize: string;
  propertyTypes: string[];
  keywords: string;
  message: string;
};

const initialFormData: BuyerFormData = {
  enquiryType: "buyer",
  buyerType: "",
  investorRegion: "",
  name: "",
  email: "",
  phone: "",
  minBudget: "",
  maxBudget: "",
  preferredLocations: "",
  propertyInterest: "",
  bedrooms: "",
  bedroomRange: false,
  bathrooms: "",
  carSpaces: "",
  minLandSize: "",
  maxLandSize: "",
  propertyTypes: [],
  keywords: "",
  message: "",
};

const propertyTypeOptions = [
  "Apartment",
  "Townhouse",
  "House",
  "Other"
];
const budgetOptions = [
  "Any",
  "$300,000",
  "$500,000",
  "$700,000",
  "$900,000",
  "$1,200,000",
  "$1,500,000",
  "$2,000,000+",
];

const landSizeOptions = [
  "Any",
  "200 sqm",
  "300 sqm",
  "400 sqm",
  "500 sqm",
  "700 sqm",
  "1000 sqm+",
];

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
        className="min-w-[180px] border border-[#5f5245] bg-[#2f2a24] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-white"
      >
        Buyers / Investors
      </Link>

      <Link
        href="/contact/developers"
        className="min-w-[180px] border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
      >
        Developers
      </Link>
    </div>
  );
}

function SegmentedOptionGroup({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
        {label}
      </label>

      <div className="flex flex-wrap overflow-hidden rounded-[18px] border border-[#cfc2b2] bg-[#f1ece4]">
        {options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`min-w-[88px] border-r border-[#cfc2b2] px-6 py-4 text-[15px] font-semibold transition last:border-r-0 ${
                active
                  ? "bg-[#2f2a24] text-white"
                  : "bg-[#f6f2eb] text-[#4b433c] hover:bg-[#ece5db]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BuyersInvestorsContactPage() {
  const [formData, setFormData] = useState<BuyerFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const showPropertyPreferences = formData.propertyInterest === "off-plan";

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckboxToggle(type: string) {
    setFormData((prev) => {
      const alreadySelected = prev.propertyTypes.includes(type);

      return {
        ...prev,
        propertyTypes: alreadySelected
          ? prev.propertyTypes.filter((item) => item !== type)
          : [...prev.propertyTypes, type],
      };
    });
  }

  function handleSegmentedChange<K extends keyof BuyerFormData>(
    field: K,
    value: BuyerFormData[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatusMessage("");
    setIsSuccess(false);

    try {
      const payload =
        formData.propertyInterest === "off-plan"
          ? formData
          : {
              ...formData,
              bedrooms: "",
              bedroomRange: false,
              bathrooms: "",
              carSpaces: "",
              minLandSize: "",
              maxLandSize: "",
              propertyTypes: [],
              keywords: "",
            };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form.");
      }

      setIsSuccess(true);
      setStatusMessage("Your buyer/investor enquiry has been submitted successfully.");
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
      <ContactTabs />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Buyers / Investors
          </p>
          <h1 className="mt-3 text-4xl font-light text-[#1f1a17] md:text-5xl">
            Register Your Property Interest
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#6c6258]">
            Tell us what you are looking for and our team will contact you with
            suitable opportunities.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-sm border border-[#e3d8ca] bg-[#fbf8f3] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            <section className="space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7b6d]">
                  Contact Details
                </p>
              </div>

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
              </div>
            </section>

            <section className="space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7b6d]">
                  Buyer Profile
                </p>
              </div>

              <div>
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Buyer Type
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9cec0] px-4 py-4">
                    <input
                      type="radio"
                      name="buyerType"
                      value="owner-occupier"
                      checked={formData.buyerType === "owner-occupier"}
                      onChange={handleChange}
                      required
                    />
                    <span className="text-[14px] text-[#1f1a17]">Owner Occupier</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9cec0] px-4 py-4">
                    <input
                      type="radio"
                      name="buyerType"
                      value="investor"
                      checked={formData.buyerType === "investor"}
                      onChange={handleChange}
                    />
                    <span className="text-[14px] text-[#1f1a17]">Investor</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Local / Overseas
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9cec0] px-4 py-4">
                    <input
                      type="radio"
                      name="investorRegion"
                      value="local"
                      checked={formData.investorRegion === "local"}
                      onChange={handleChange}
                      required
                    />
                    <span className="text-[14px] text-[#1f1a17]">Local</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9cec0] px-4 py-4">
                    <input
                      type="radio"
                      name="investorRegion"
                      value="overseas"
                      checked={formData.investorRegion === "overseas"}
                      onChange={handleChange}
                    />
                    <span className="text-[14px] text-[#1f1a17]">Overseas</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Property Interest
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9cec0] px-4 py-4">
                    <input
                      type="radio"
                      name="propertyInterest"
                      value="off-plan"
                      checked={formData.propertyInterest === "off-plan"}
                      onChange={handleChange}
                      required
                    />
                    <span className="text-[14px] text-[#1f1a17]">Off-plan</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9cec0] px-4 py-4">
                    <input
                      type="radio"
                      name="propertyInterest"
                      value="established"
                      checked={formData.propertyInterest === "established"}
                      onChange={handleChange}
                    />
                    <span className="text-[14px] text-[#1f1a17]">Established</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Preferred Locations
                </label>
                <input
                  type="text"
                  name="preferredLocations"
                  value={formData.preferredLocations}
                  onChange={handleChange}
                  placeholder="e.g. Hawthorn, Kew, Brunswick, South Yarra"
                  required
                  className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Min Budget
                  </label>
                  <select
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                  >
                    <option value="">Select minimum budget</option>
                    {budgetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Max Budget
                  </label>
                  <select
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                  >
                    <option value="">Select maximum budget</option>
                    {budgetOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {showPropertyPreferences && (
              <section className="space-y-10 border-t border-[#e3d8ca] pt-10">
                <div>
                  <h2 className="text-2xl font-light text-[#1f1a17]">
                    Property Preferences
                  </h2>
                  <p className="mt-2 text-[14px] leading-7 text-[#6c6258]">
                    Tell us the type of off-plan property and features you are looking for.
                  </p>
                </div>

                <SegmentedOptionGroup
                  label="Bedrooms"
                  value={formData.bedrooms}
                  onSelect={(value) => handleSegmentedChange("bedrooms", value)}
                  options={[
                    { label: "Any", value: "any" },
                    { label: "Studio+", value: "studio" },
                    { label: "1+", value: "1" },
                    { label: "2+", value: "2" },
                    { label: "3+", value: "3" },
                    { label: "4+", value: "4" },
                    { label: "5+", value: "5" },
                  ]}
                />

                <div className="flex items-center justify-between rounded-sm border border-[#d9cec0] px-4 py-4">
                  <div>
                    <p className="text-[14px] font-medium text-[#1f1a17]">
                      Select bedroom range
                    </p>
                    <p className="text-[13px] text-[#7a7065]">
                      Enable if the buyer wants flexibility in bedroom count.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bedroomRange: !prev.bedroomRange,
                      }))
                    }
                    className={`relative h-8 w-16 rounded-full transition ${
                      formData.bedroomRange ? "bg-[#2f2a24]" : "bg-[#d7cec1]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                        formData.bedroomRange ? "left-9" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <SegmentedOptionGroup
                  label="Bathrooms"
                  value={formData.bathrooms}
                  onSelect={(value) => handleSegmentedChange("bathrooms", value)}
                  options={[
                    { label: "Any", value: "any" },
                    { label: "1+", value: "1" },
                    { label: "2+", value: "2" },
                    { label: "3+", value: "3" },
                    { label: "4+", value: "4" },
                    { label: "5+", value: "5" },
                  ]}
                />

                <SegmentedOptionGroup
                  label="Car Spaces"
                  value={formData.carSpaces}
                  onSelect={(value) => handleSegmentedChange("carSpaces", value)}
                  options={[
                    { label: "Any", value: "any" },
                    { label: "1+", value: "1" },
                    { label: "2+", value: "2" },
                    { label: "3+", value: "3" },
                    { label: "4+", value: "4" },
                    { label: "5+", value: "5" },
                  ]}
                />

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Min Land Size
                    </label>
                    <select
                      name="minLandSize"
                      value={formData.minLandSize}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      <option value="">Any</option>
                      {landSizeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Land Size
                    </label>
                    <select
                      name="maxLandSize"
                      value={formData.maxLandSize}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      <option value="">Any</option>
                      {landSizeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Property Type
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    {propertyTypeOptions.map((type) => {
                      const checked = formData.propertyTypes.includes(type);

                      return (
                        <label
                          key={type}
                          className="flex items-center gap-3 text-[15px] text-[#1f1a17]"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxToggle(type)}
                            className="h-4 w-4"
                          />
                          <span>{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Keywords
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    placeholder="Air con, pool, garage, solar, ensuite..."
                    className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                  />
                  <p className="mt-2 text-[13px] text-[#7a7065]">
                    Add specific property features to your search.
                  </p>
                </div>
              </section>
            )}

            <section className="space-y-8 border-t border-[#e3d8ca] pt-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7b6d]">
                  Additional Notes
                </p>
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
                  placeholder="Tell us a little about what you're looking for"
                  className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] p-4 text-[14px] text-[#1f1a17] outline-none resize-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                />
              </div>
            </section>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[220px] items-center justify-center rounded-sm bg-[#2f2a24] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f1a17] disabled:cursor-not-allowed disabled:opacity-60"
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