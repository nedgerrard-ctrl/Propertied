"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const MAX_DOCUMENTS = 3;
const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024;

type SelectedLegalDocument = {
  file: File;
  previewId: string;
};

type BuyerFormData = {
  enquiryType: "buyer";
  buyerType: "owner-occupier" | "investor" | "";
  investorRegion: "local" | "overseas" | "";
  name: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  minBudget: string;
  maxBudget: string;
  preferredLocations: string;
  propertyInterest: "off-plan" | "established" | "";
  minBedrooms: string;
  maxBedrooms: string;
  minBathrooms: string;
  maxBathrooms: string;
  minCarSpaces: string;
  maxCarSpaces: string;
  propertyType: string;
  keywords: string;
  message: string;
};

const initialFormData: BuyerFormData = {
  enquiryType: "buyer",
  buyerType: "",
  investorRegion: "",
  name: "",
  email: "",
  phoneCountryCode: "+61",
  phone: "",
  minBudget: "",
  maxBudget: "",
  preferredLocations: "",
  propertyInterest: "",
  minBedrooms: "",
  maxBedrooms: "",
  minBathrooms: "",
  maxBathrooms: "",
  minCarSpaces: "",
  maxCarSpaces: "",
  propertyType: "",
  keywords: "",
  message: "",
};

const propertyTypeOptions = ["Apartment", "Townhouse", "House"];

const budgetOptions = [
  { label: "Any", value: "" },
  { label: "$300,000", value: "300000" },
  { label: "$500,000", value: "500000" },
  { label: "$700,000", value: "700000" },
  { label: "$900,000", value: "900000" },
  { label: "$1,200,000", value: "1200000" },
  { label: "$1,500,000", value: "1500000" },
  { label: "$2,000,000+", value: "2000000" },
];

const roomOptions = [
  { label: "Any", value: "" },
  { label: "Studio", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5" },
];

const bathroomCarOptions = [
  { label: "Any", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5" },
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

function getFilteredRangeOptions(
  options: { label: string; value: string }[],
  minValue: string
) {
  if (!minValue) return options;

  return options.filter((option) => {
    if (!option.value) return true;
    return Number(option.value) >= Number(minValue);
  });
}

function parseBedroomRange(rawBedrooms: string) {
  const cleaned = rawBedrooms.trim();

  if (!cleaned) {
    return {
      minBedrooms: "",
      maxBedrooms: "",
    };
  }

  const rangeMatch = cleaned.match(/(\d+)\s*(?:-|–|—|to)\s*(\d+)/i);
  if (rangeMatch) {
    return {
      minBedrooms: rangeMatch[1],
      maxBedrooms: rangeMatch[2],
    };
  }

  const singleMatch = cleaned.match(/(\d+)/);
  if (singleMatch) {
    return {
      minBedrooms: singleMatch[1],
      maxBedrooms: singleMatch[1],
    };
  }

  return {
    minBedrooms: "",
    maxBedrooms: "",
  };
}

function buildPrefilledFormData(searchParams: URLSearchParams): Partial<BuyerFormData> {
  const projectName = searchParams.get("projectName")?.trim() ?? "";
  const suburb = searchParams.get("suburb")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";
  const propertyType = searchParams.get("propertyType")?.trim() ?? "";
  const propertyInterest = searchParams.get("propertyInterest")?.trim() ?? "";
  const bedrooms = searchParams.get("bedrooms")?.trim() ?? "";
  const priceFrom = searchParams.get("priceFrom")?.trim() ?? "";

  const preferredLocations = [suburb, state].filter(Boolean).join(", ");

  const keywordParts = [projectName, bedrooms, priceFrom].filter(Boolean);
  const keywords = keywordParts.join(" • ");

  const messageLines = [
    projectName ? `I am enquiring about ${projectName}.` : "",
    preferredLocations ? `Location: ${preferredLocations}` : "",
    propertyType ? `Property type: ${propertyType}` : "",
    bedrooms ? `Bedrooms: ${bedrooms}` : "",
    priceFrom ? `Guide price: ${priceFrom}` : "",
  ].filter(Boolean);

  const safePropertyInterest =
    propertyInterest === "off-plan" || propertyInterest === "established"
      ? propertyInterest
      : "";

  const safePropertyType = propertyTypeOptions.includes(propertyType)
    ? propertyType
    : "";

  const { minBedrooms, maxBedrooms } = parseBedroomRange(bedrooms);

  return {
    preferredLocations,
    propertyInterest: safePropertyInterest as BuyerFormData["propertyInterest"],
    propertyType: safePropertyType,
    minBedrooms,
    maxBedrooms,
    keywords,
    message: messageLines.join("\n"),
  };
}

function formatFileSize(fileSize: number) {
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BuyersInvestorsContactPage() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<BuyerFormData>(initialFormData);
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedLegalDocument[]>([]);
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

  useEffect(() => {
    const hasPrefillParams =
      searchParams.get("projectName") ||
      searchParams.get("suburb") ||
      searchParams.get("state") ||
      searchParams.get("propertyType") ||
      searchParams.get("propertyInterest") ||
      searchParams.get("bedrooms") ||
      searchParams.get("priceFrom");

    if (!hasPrefillParams) return;

    const prefilled = buildPrefilledFormData(searchParams);

    setFormData((prev) => ({
      ...prev,
      ...prefilled,
    }));
  }, [searchParams]);

  const showPropertyPreferences = formData.propertyInterest === "off-plan";

  const filteredMaxBudgetOptions = useMemo(
    () => getFilteredRangeOptions(budgetOptions, formData.minBudget),
    [formData.minBudget]
  );

  const filteredMaxBedroomOptions = useMemo(
    () => getFilteredRangeOptions(roomOptions, formData.minBedrooms),
    [formData.minBedrooms]
  );

  const filteredMaxBathroomOptions = useMemo(
    () => getFilteredRangeOptions(bathroomCarOptions, formData.minBathrooms),
    [formData.minBathrooms]
  );

  const filteredMaxCarSpaceOptions = useMemo(
    () => getFilteredRangeOptions(bathroomCarOptions, formData.minCarSpaces),
    [formData.minCarSpaces]
  );

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "minBudget" && next.maxBudget && Number(next.maxBudget) < Number(value)) {
        next.maxBudget = "";
      }

      if (
        name === "minBedrooms" &&
        next.maxBedrooms &&
        Number(next.maxBedrooms) < Number(value)
      ) {
        next.maxBedrooms = "";
      }

      if (
        name === "minBathrooms" &&
        next.maxBathrooms &&
        Number(next.maxBathrooms) < Number(value)
      ) {
        next.maxBathrooms = "";
      }

      if (
        name === "minCarSpaces" &&
        next.maxCarSpaces &&
        Number(next.maxCarSpaces) < Number(value)
      ) {
        next.maxCarSpaces = "";
      }

      return next;
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    if (selectedDocuments.length + files.length > MAX_DOCUMENTS) {
      setFeedbackModal({
        open: true,
        title: "Too Many Files",
        message: `You can upload up to ${MAX_DOCUMENTS} legal documents.`,
        success: false,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const invalidTypeFile = files.find(
      (file) => !ALLOWED_DOCUMENT_TYPES.includes(file.type)
    );

    if (invalidTypeFile) {
      setFeedbackModal({
        open: true,
        title: "Invalid File Type",
        message: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed.",
        success: false,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_DOCUMENT_SIZE_BYTES);

    if (oversizedFile) {
      setFeedbackModal({
        open: true,
        title: "File Too Large",
        message: "Each legal document must be 5MB or smaller.",
        success: false,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const nextDocuments = files.map((file) => ({
      file,
      previewId: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    }));

    setSelectedDocuments((prev) => [...prev, ...nextDocuments]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveDocument(previewId: string) {
    setSelectedDocuments((prev) => prev.filter((doc) => doc.previewId !== previewId));
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

    if (
      formData.minBudget &&
      formData.maxBudget &&
      Number(formData.maxBudget) < Number(formData.minBudget)
    ) {
      setFeedbackModal({
        open: true,
        title: "Invalid Budget Range",
        message: "Maximum budget cannot be lower than minimum budget.",
        success: false,
      });
      setLoading(false);
      return;
    }

    if (
      formData.minBedrooms &&
      formData.maxBedrooms &&
      Number(formData.maxBedrooms) < Number(formData.minBedrooms)
    ) {
      setFeedbackModal({
        open: true,
        title: "Invalid Bedroom Range",
        message: "Maximum bedrooms cannot be lower than minimum bedrooms.",
        success: false,
      });
      setLoading(false);
      return;
    }

    if (
      formData.minBathrooms &&
      formData.maxBathrooms &&
      Number(formData.maxBathrooms) < Number(formData.minBathrooms)
    ) {
      setFeedbackModal({
        open: true,
        title: "Invalid Bathroom Range",
        message: "Maximum bathrooms cannot be lower than minimum bathrooms.",
        success: false,
      });
      setLoading(false);
      return;
    }

    if (
      formData.minCarSpaces &&
      formData.maxCarSpaces &&
      Number(formData.maxCarSpaces) < Number(formData.minCarSpaces)
    ) {
      setFeedbackModal({
        open: true,
        title: "Invalid Car Space Range",
        message: "Maximum car spaces cannot be lower than minimum car spaces.",
        success: false,
      });
      setLoading(false);
      return;
    }

    try {
      const payload =
        formData.propertyInterest === "off-plan"
          ? formData
          : {
              ...formData,
              minBedrooms: "",
              maxBedrooms: "",
              minBathrooms: "",
              maxBathrooms: "",
              minCarSpaces: "",
              maxCarSpaces: "",
              propertyType: "",
              keywords: "",
            };

      const multipartData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        multipartData.append(key, value);
      });

      selectedDocuments.forEach((document) => {
        multipartData.append("legalDocuments", document.file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: multipartData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form.");
      }

      setFeedbackModal({
        open: true,
        title: "Enquiry Submitted",
        message: "Your buyer/investor enquiry has been submitted successfully.",
        success: true,
      });
      setFormData(initialFormData);
      setSelectedDocuments([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
                    maxLength={100}
                    className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
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
                      className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none"
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
                      className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
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
                    placeholder="Enter your email"
                    required
                    maxLength={120}
                    className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-10 border-t border-[#e3d8ca] pt-10">
              <div>
                <h2 className="text-2xl font-light text-[#1f1a17]">
                  Buyer Profile
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6c6258]">
                  Help us understand your buying goals so we can recommend
                  suitable opportunities.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Buyer Type
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Owner-Occupier", value: "owner-occupier" },
                      { label: "Investor", value: "investor" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer border px-4 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                          formData.buyerType === option.value
                            ? "border-[#5f5245] bg-[#2f2a24] text-white"
                            : "border-[#d9cec0] bg-[#fdfbf8] text-[#5b5147] hover:border-[#5f5245]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="buyerType"
                          value={option.value}
                          checked={formData.buyerType === option.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Buyer Region
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Local", value: "local" },
                      { label: "Overseas", value: "overseas" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer border px-4 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                          formData.investorRegion === option.value
                            ? "border-[#5f5245] bg-[#2f2a24] text-white"
                            : "border-[#d9cec0] bg-[#fdfbf8] text-[#5b5147] hover:border-[#5f5245]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="investorRegion"
                          value={option.value}
                          checked={formData.investorRegion === option.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Property Interest
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Off-the-Plan", value: "off-plan" },
                    { label: "Established", value: "established" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer border px-4 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                        formData.propertyInterest === option.value
                          ? "border-[#5f5245] bg-[#2f2a24] text-white"
                          : "border-[#d9cec0] bg-[#fdfbf8] text-[#5b5147] hover:border-[#5f5245]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="propertyInterest"
                        value={option.value}
                        checked={formData.propertyInterest === option.value}
                        onChange={handleChange}
                        className="sr-only"
                        required
                      />
                      {option.label}
                    </label>
                  ))}
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
                  maxLength={150}
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
                      <option key={option.label} value={option.value}>
                        {option.label}
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
                    {filteredMaxBudgetOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
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

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Min Bedrooms
                    </label>
                    <select
                      name="minBedrooms"
                      value={formData.minBedrooms}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      {roomOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Bedrooms
                    </label>
                    <select
                      name="maxBedrooms"
                      value={formData.maxBedrooms}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      {filteredMaxBedroomOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Min Bathrooms
                    </label>
                    <select
                      name="minBathrooms"
                      value={formData.minBathrooms}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      {bathroomCarOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Bathrooms
                    </label>
                    <select
                      name="maxBathrooms"
                      value={formData.maxBathrooms}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      {filteredMaxBathroomOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Min Car Spaces
                    </label>
                    <select
                      name="minCarSpaces"
                      value={formData.minCarSpaces}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      {bathroomCarOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Car Spaces
                    </label>
                    <select
                      name="maxCarSpaces"
                      value={formData.maxCarSpaces}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      {filteredMaxCarSpaceOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none"
                    >
                      <option value="">Select property type</option>
                      {propertyTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Keywords / Notes
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      placeholder="e.g. city views, north-facing, low body corp"
                      maxLength={300}
                      className="w-full border-b border-[#cfc2b2] bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="space-y-6 border-t border-[#e3d8ca] pt-10">
              <div>
                <h2 className="text-2xl font-light text-[#1f1a17]">
                  Legal Documents
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6c6258]">
                  Upload supporting legal documents. Files are stored in
                  <span className="font-medium"> public/uploads/legal-documents/</span>.
                  Maximum {MAX_DOCUMENTS} files, 5MB each.
                </p>
              </div>

              <div className="rounded-sm border border-[#d9cec0] bg-[#fdfbf8] p-5">
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                  Upload Legal Documents
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="block w-full text-[13px] text-[#5b5147] file:mr-4 file:rounded-sm file:border-0 file:bg-[#2f2a24] file:px-4 file:py-2.5 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.16em] file:text-white hover:file:bg-[#1f1a17]"
                />

                <p className="mt-3 text-[12px] text-[#8a7b6d]">
                  Accepted: PDF, DOC, DOCX, JPG, PNG
                </p>

                {selectedDocuments.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {selectedDocuments.map((document) => (
                      <div
                        key={document.previewId}
                        className="flex items-center justify-between gap-4 rounded-sm border border-[#e3d8ca] bg-white px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-[#1f1a17]">
                            {document.file.name}
                          </p>
                          <p className="mt-1 text-[12px] text-[#8a7b6d]">
                            {document.file.type || "Unknown type"} · {formatFileSize(document.file.size)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(document.previewId)}
                          className="shrink-0 rounded-sm border border-[#d7cabc] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b5147] transition hover:border-[#5f5245] hover:text-[#1f1a17]"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6 border-t border-[#e3d8ca] pt-10">
              <div>
                <h2 className="text-2xl font-light text-[#1f1a17]">
                  Additional Information
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#6c6258]">
                  Share any extra details that will help us understand what you
                  are looking for.
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
                  maxLength={1000}
                  placeholder="Tell us more about your property goals, timeframe, and any specific requirements."
                  className="w-full rounded-sm border border-[#d9cec0] bg-[#fdfbf8] px-4 py-4 text-[14px] leading-7 text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] focus:border-[#5f5245]"
                />
              </div>
            </section>

            <div className="border-t border-[#e3d8ca] pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm bg-[#2f2a24] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#1f1a17] disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
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
              onClick={() =>
                setFeedbackModal((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
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
