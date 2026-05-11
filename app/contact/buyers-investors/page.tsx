"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCountryCodes } from "../useCountryCodes";

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

type BuyerFieldErrors = Partial<Record<keyof BuyerFormData, string>>;

const initialFormData: BuyerFormData = {
  enquiryType: "buyer",
  buyerType: "",
  investorRegion: "",
  name: "",
  email: "",
  phoneCountryCode: "",
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

const minBudgetOptions = [
  { label: "Any", value: "0" },
  { label: "$300,000", value: "300000" },
  { label: "$500,000", value: "500000" },
  { label: "$700,000", value: "700000" },
  { label: "$900,000", value: "900000" },
  { label: "$1,200,000", value: "1200000" },
  { label: "$1,500,000", value: "1500000" },
  { label: "$2,000,000+", value: "2000000" },
];

const maxBudgetOptions = [
  { label: "Any", value: "2147483647" },
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

function validateBuyerField(
  name: keyof BuyerFormData,
  value: string,
  formData: BuyerFormData
): string {
  const trimmedValue = value.trim();

  switch (name) {
    case "name":
  if (!trimmedValue) return "Enter your full name";
  if (value.length > 100) return "This field is too long";
  if (!NAME_REGEX.test(trimmedValue)) return "Name can contain letters and spaces only";
  return "";

    case "email":
      if (!trimmedValue) return "Enter your email address";
      if (!EMAIL_REGEX.test(trimmedValue)) return "Enter a valid email address";
      return "";

    case "phoneCountryCode":
      if (!trimmedValue) return "Select a country code";
      return "";

    case "phone": {
      if (!trimmedValue) return "Enter your phone number";
      const normalizedPhone = normalizePhone(value);
      if (!PHONE_REGEX.test(normalizedPhone)) return "Enter a valid phone number";
      return "";
    }

    case "buyerType":
      return trimmedValue ? "" : "Select buyer type";

    case "investorRegion":
      return trimmedValue ? "" : "Select investor region";

    case "minBudget":
      return trimmedValue ? "" : "Select a minimum budget";

    case "maxBudget":
      if (!trimmedValue) return "Select a maximum budget";
      if (formData.minBudget && Number(value) < Number(formData.minBudget)) {
        return "Maximum budget cannot be lower than minimum budget";
      }
      return "";

    case "preferredLocations":
      return trimmedValue ? "" : "Enter preferred locations";

    case "propertyInterest":
      return trimmedValue ? "" : "Select property interest";

    case "minBedrooms":
      return "";

    case "maxBedrooms":
      if (!trimmedValue || !formData.minBedrooms) return "";
      if (Number(value) < Number(formData.minBedrooms)) {
        return "Maximum bedrooms cannot be lower than minimum bedrooms";
      }
      return "";

    case "minBathrooms":
      return "";

    case "maxBathrooms":
      if (!trimmedValue || !formData.minBathrooms) return "";
      if (Number(value) < Number(formData.minBathrooms)) {
        return "Maximum bathrooms cannot be lower than minimum bathrooms";
      }
      return "";

    case "minCarSpaces":
      return "";

    case "maxCarSpaces":
      if (!trimmedValue || !formData.minCarSpaces) return "";
      if (Number(value) < Number(formData.minCarSpaces)) {
        return "Maximum car spaces cannot be lower than minimum car spaces";
      }
      return "";

    case "propertyType":
      return "";

    case "keywords":
      return "";

    case "message":
      return "";

    case "enquiryType":
      return "";

    default:
      return "";
  }
}

function validateBuyerForm(formData: BuyerFormData): BuyerFieldErrors {
  return {
    name: validateBuyerField("name", formData.name, formData),
    email: validateBuyerField("email", formData.email, formData),
    phoneCountryCode: validateBuyerField("phoneCountryCode", formData.phoneCountryCode, formData),
    phone: validateBuyerField("phone", formData.phone, formData),
    buyerType: validateBuyerField("buyerType", formData.buyerType, formData),
    investorRegion: validateBuyerField("investorRegion", formData.investorRegion, formData),
    minBudget: validateBuyerField("minBudget", formData.minBudget, formData),
    maxBudget: validateBuyerField("maxBudget", formData.maxBudget, formData),
    preferredLocations: validateBuyerField("preferredLocations", formData.preferredLocations, formData),
    propertyInterest: validateBuyerField("propertyInterest", formData.propertyInterest, formData),
    minBedrooms: validateBuyerField("minBedrooms", formData.minBedrooms, formData),
    maxBedrooms: validateBuyerField("maxBedrooms", formData.maxBedrooms, formData),
    minBathrooms: validateBuyerField("minBathrooms", formData.minBathrooms, formData),
    maxBathrooms: validateBuyerField("maxBathrooms", formData.maxBathrooms, formData),
    minCarSpaces: validateBuyerField("minCarSpaces", formData.minCarSpaces, formData),
    maxCarSpaces: validateBuyerField("maxCarSpaces", formData.maxCarSpaces, formData),
    propertyType: validateBuyerField("propertyType", formData.propertyType, formData),
    keywords: validateBuyerField("keywords", formData.keywords, formData),
    message: validateBuyerField("message", formData.message, formData),
  };
}

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

function parseNumericRange(rawValue: string) {
  const cleaned = rawValue.trim();

  if (!cleaned) {
    return {
      min: "",
      max: "",
    };
  }

  const rangeMatch = cleaned.match(/(\d+)\s*(?:-|–|—|to)\s*(\d+)/i);
  if (rangeMatch) {
    return {
      min: rangeMatch[1],
      max: rangeMatch[2],
    };
  }

  const singleMatch = cleaned.match(/(\d+)/);
  if (singleMatch) {
    return {
      min: singleMatch[1],
      max: singleMatch[1],
    };
  }

  return {
    min: "",
    max: "",
  };
}

function buildPrefilledFormData(
  searchParams: URLSearchParams
): Partial<BuyerFormData> {
  const projectName = searchParams.get("projectName")?.trim() ?? "";
  const suburb = searchParams.get("suburb")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";
  const propertyType = searchParams.get("propertyType")?.trim() ?? "";
  const propertyInterest = searchParams.get("propertyInterest")?.trim() ?? "";
  const bedrooms = searchParams.get("bedrooms")?.trim() ?? "";
  const bathrooms = searchParams.get("bathrooms")?.trim() ?? "";
  const carSpaces = searchParams.get("carSpaces")?.trim() ?? "";
  const priceFrom = searchParams.get("priceFrom")?.trim() ?? "";

  const preferredLocations = [suburb, state].filter(Boolean).join(", ");

  const messageLines = [
    projectName ? `I am enquiring about ${projectName}.` : "",
    preferredLocations ? `Location: ${preferredLocations}` : "",
    propertyType ? `Property type: ${propertyType}` : "",
    bedrooms ? `Bedrooms: ${bedrooms}` : "",
    bathrooms ? `Bathrooms: ${bathrooms}` : "",
    carSpaces ? `Car spaces: ${carSpaces}` : "",
    priceFrom ? `Guide price: ${priceFrom}` : "",
  ].filter(Boolean);

  const safePropertyInterest =
    propertyInterest === "off-plan" || propertyInterest === "established"
      ? propertyInterest
      : "";

  const safePropertyType = propertyTypeOptions.includes(propertyType)
    ? propertyType
    : "";

  const bedroomRange = parseNumericRange(bedrooms);
  const bathroomRange = parseNumericRange(bathrooms);
  const carSpaceRange = parseNumericRange(carSpaces);

  return {
    preferredLocations,
    propertyInterest: safePropertyInterest as BuyerFormData["propertyInterest"],
    propertyType: safePropertyType,
    minBedrooms: bedroomRange.min,
    maxBedrooms: bedroomRange.max,
    minBathrooms: bathroomRange.min,
    maxBathrooms: bathroomRange.max,
    minCarSpaces: carSpaceRange.min,
    maxCarSpaces: carSpaceRange.max,
    keywords: projectName,
    message: messageLines.join("\n"),
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-3 text-[14px] text-[#dc2626]">{message}</p>;
}

function getUnderlineInputClass(hasError: boolean) {
  return `w-full border-b bg-transparent px-0 py-3 text-[14px] text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] ${
    hasError
      ? "border-[#dc2626] focus:border-[#dc2626]"
      : "border-[#cfc2b2] focus:border-[#5f5245]"
  }`;
}

function getBoxInputClass(hasError: boolean) {
  return `w-full rounded-sm border bg-[#fdfbf8] px-4 py-4 text-[14px] text-[#1f1a17] outline-none transition ${
    hasError
      ? "border-[#dc2626] focus:border-[#dc2626]"
      : "border-[#d9cec0] focus:border-[#5f5245]"
  }`;
}

function getTextareaClass(hasError: boolean) {
  return `w-full rounded-sm border bg-[#fdfbf8] px-4 py-4 text-[14px] leading-7 text-[#1f1a17] outline-none transition placeholder:text-[#9c9186] resize-none ${
    hasError
      ? "border-[#dc2626] focus:border-[#dc2626]"
      : "border-[#d9cec0] focus:border-[#5f5245]"
  }`;
}

function BuyersInvestorsContactContent() {
  const searchParams = useSearchParams();
  const { countries, defaultDialCode } = useCountryCodes("+61");
  const { data: session } = useSession();

  const [formData, setFormData] = useState<BuyerFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<BuyerFieldErrors>({});
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
    setFormData((prev) =>
      prev.phoneCountryCode
        ? prev
        : { ...prev, phoneCountryCode: defaultDialCode }
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
  useEffect(() => {
    const hasPrefillParams =
      searchParams.get("projectName") ||
      searchParams.get("suburb") ||
      searchParams.get("state") ||
      searchParams.get("propertyType") ||
      searchParams.get("propertyInterest") ||
      searchParams.get("bedrooms") ||
      searchParams.get("bathrooms") ||
      searchParams.get("carSpaces") ||
      searchParams.get("priceFrom");

    if (!hasPrefillParams) return;

    const prefilled = buildPrefilledFormData(searchParams);

    setFormData((prev) => ({
      ...prev,
      ...prefilled,
    }));
  }, [searchParams]);

  const showPropertyPreferences = true;

  const filteredMaxBudgetOptions = useMemo(
    () => getFilteredRangeOptions(maxBudgetOptions, formData.minBudget),
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
    const fieldName = name as keyof BuyerFormData;

    setFormData((prev) => {
      const next = { ...prev, [fieldName]: value } as BuyerFormData;

      if (
        fieldName === "minBudget" &&
        next.maxBudget &&
        Number(next.maxBudget) < Number(value)
      ) {
        next.maxBudget = "";
      }

      if (
        fieldName === "minBedrooms" &&
        next.maxBedrooms &&
        Number(next.maxBedrooms) < Number(value)
      ) {
        next.maxBedrooms = "";
      }

      if (
        fieldName === "minBathrooms" &&
        next.maxBathrooms &&
        Number(next.maxBathrooms) < Number(value)
      ) {
        next.maxBathrooms = "";
      }

      if (
        fieldName === "minCarSpaces" &&
        next.maxCarSpaces &&
        Number(next.maxCarSpaces) < Number(value)
      ) {
        next.maxCarSpaces = "";
      }

      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validateBuyerField(fieldName, value, next),
        maxBudget: validateBuyerField("maxBudget", next.maxBudget, next),
        maxBedrooms: validateBuyerField("maxBedrooms", next.maxBedrooms, next),
        maxBathrooms: validateBuyerField("maxBathrooms", next.maxBathrooms, next),
        maxCarSpaces: validateBuyerField("maxCarSpaces", next.maxCarSpaces, next),
      }));

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (session?.user?.userType === "developer") {
      setFeedbackModal({
        open: true,
        title: "Not Allowed",
        message: "As a developer, you are not permitted to submit buyer or investor enquiries. Please use the Developer Enquiry form.",
        success: false,
      });
      return;
    }

    const validationErrors = validateBuyerForm(formData);
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
      const multipartData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        multipartData.append(key, value);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: multipartData,
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
        message: "Your buyer/investor enquiry has been submitted successfully.",
        success: true,
      });
      setFormData(initialFormData);
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
          <form onSubmit={handleSubmit} noValidate className="space-y-12">
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
                        className={getUnderlineInputClass(
                          Boolean(fieldErrors.phoneCountryCode)
                        )}
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
                    placeholder="Enter your email"
                    maxLength={120}
                    aria-invalid={Boolean(fieldErrors.email)}
                    className={getUnderlineInputClass(Boolean(fieldErrors.email))}
                  />
                  <FieldError message={fieldErrors.email} />
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
                        } ${
                          fieldErrors.buyerType ? "ring-1 ring-[#dc2626]" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="buyerType"
                          value={option.value}
                          checked={formData.buyerType === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <FieldError message={fieldErrors.buyerType} />
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
                        } ${
                          fieldErrors.investorRegion ? "ring-1 ring-[#dc2626]" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="investorRegion"
                          value={option.value}
                          checked={formData.investorRegion === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <FieldError message={fieldErrors.investorRegion} />
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
                      } ${
                        fieldErrors.propertyInterest ? "ring-1 ring-[#dc2626]" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="propertyInterest"
                        value={option.value}
                        checked={formData.propertyInterest === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <FieldError message={fieldErrors.propertyInterest} />
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
                  maxLength={150}
                  aria-invalid={Boolean(fieldErrors.preferredLocations)}
                  className={getUnderlineInputClass(
                    Boolean(fieldErrors.preferredLocations)
                  )}
                />
                <FieldError message={fieldErrors.preferredLocations} />
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
                    aria-invalid={Boolean(fieldErrors.minBudget)}
                    className={getBoxInputClass(Boolean(fieldErrors.minBudget))}
                  >
                    <option value="">Select minimum budget</option>
                    {minBudgetOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.minBudget} />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                    Max Budget
                  </label>
                  <select
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.maxBudget)}
                    className={getBoxInputClass(Boolean(fieldErrors.maxBudget))}
                  >
                    <option value="">Select maximum budget</option>
                    {filteredMaxBudgetOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.maxBudget} />
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
                    Tell us the property type and features you are looking for, for either off-the-plan or established opportunities.
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
                      aria-invalid={Boolean(fieldErrors.minBedrooms)}
                      className={getBoxInputClass(Boolean(fieldErrors.minBedrooms))}
                    >
                      {roomOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.minBedrooms} />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Bedrooms
                    </label>
                    <select
                      name="maxBedrooms"
                      value={formData.maxBedrooms}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.maxBedrooms)}
                      className={getBoxInputClass(Boolean(fieldErrors.maxBedrooms))}
                    >
                      {filteredMaxBedroomOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.maxBedrooms} />
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
                      aria-invalid={Boolean(fieldErrors.minBathrooms)}
                      className={getBoxInputClass(Boolean(fieldErrors.minBathrooms))}
                    >
                      {bathroomCarOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.minBathrooms} />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Bathrooms
                    </label>
                    <select
                      name="maxBathrooms"
                      value={formData.maxBathrooms}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.maxBathrooms)}
                      className={getBoxInputClass(Boolean(fieldErrors.maxBathrooms))}
                    >
                      {filteredMaxBathroomOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.maxBathrooms} />
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
                      aria-invalid={Boolean(fieldErrors.minCarSpaces)}
                      className={getBoxInputClass(Boolean(fieldErrors.minCarSpaces))}
                    >
                      {bathroomCarOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.minCarSpaces} />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6055]">
                      Max Car Spaces
                    </label>
                    <select
                      name="maxCarSpaces"
                      value={formData.maxCarSpaces}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.maxCarSpaces)}
                      className={getBoxInputClass(Boolean(fieldErrors.maxCarSpaces))}
                    >
                      {filteredMaxCarSpaceOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.maxCarSpaces} />
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
                      aria-invalid={Boolean(fieldErrors.propertyType)}
                      className={getBoxInputClass(Boolean(fieldErrors.propertyType))}
                    >
                      <option value="">Select property type</option>
                      {propertyTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <FieldError message={fieldErrors.propertyType} />
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
                      aria-invalid={Boolean(fieldErrors.keywords)}
                      className={getUnderlineInputClass(Boolean(fieldErrors.keywords))}
                    />
                    <FieldError message={fieldErrors.keywords} />
                  </div>
                </div>
              </section>
            )}

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
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={getTextareaClass(Boolean(fieldErrors.message))}
                />
                <FieldError message={fieldErrors.message} />
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

export default function BuyersInvestorsContactPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4f1ea]" />}>
      <BuyersInvestorsContactContent />
    </Suspense>
  );
}