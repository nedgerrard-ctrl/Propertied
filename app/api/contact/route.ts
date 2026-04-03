import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizePhone(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s|-/g, "").trim();
}

function validateMaxLength(value: unknown, max: number) {
  return typeof value !== "string" || value.length <= max;
}

function toNumberOrNull(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      enquiryType,
      name,
      email,
      phoneCountryCode,
      phone,
      message,

      // buyer
      buyerType,
      investorRegion,
      minBudget,
      maxBudget,
      preferredLocations,
      propertyInterest,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minCarSpaces,
      maxCarSpaces,
      propertyTypes,
      keywords,

      // developer
      projectName,
      projectLocation,
      commissionStructureInterest,
    } = body;

    if (!["general", "developer", "buyer"].includes(enquiryType)) {
      return NextResponse.json(
        { success: false, message: "Invalid enquiry type." },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(phoneCountryCode) || !isNonEmptyString(phone)) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const maxLengthChecks = [
      [name, 100],
      [email, 120],
      [phoneCountryCode, 6],
      [phone, 20],
      [message, 1000],
      [preferredLocations, 150],
      [keywords, 300],
      [projectName, 120],
      [projectLocation, 120],
      [commissionStructureInterest, 150],
    ];

    const hasInvalidLength = maxLengthChecks.some(
      ([value, max]) => !validateMaxLength(value, max as number)
    );

    if (hasInvalidLength) {
      return NextResponse.json(
        { success: false, message: "One or more fields exceed the maximum allowed length." },
        { status: 400 }
      );
    }

    if (enquiryType === "buyer") {
      if (
        !isNonEmptyString(buyerType) ||
        !isNonEmptyString(investorRegion) ||
        !isNonEmptyString(minBudget) ||
        !isNonEmptyString(maxBudget) ||
        !isNonEmptyString(preferredLocations) ||
        !isNonEmptyString(propertyInterest)
      ) {
        return NextResponse.json(
          { success: false, message: "Please fill in all required buyer/investor fields." },
          { status: 400 }
        );
      }

      const minBudgetValue = toNumberOrNull(minBudget);
      const maxBudgetValue = toNumberOrNull(maxBudget);

      if (minBudgetValue !== null && maxBudgetValue !== null && maxBudgetValue < minBudgetValue) {
        return NextResponse.json(
          { success: false, message: "Maximum budget cannot be lower than minimum budget." },
          { status: 400 }
        );
      }

      const minBedroomsValue = toNumberOrNull(minBedrooms);
      const maxBedroomsValue = toNumberOrNull(maxBedrooms);
      const minBathroomsValue = toNumberOrNull(minBathrooms);
      const maxBathroomsValue = toNumberOrNull(maxBathrooms);
      const minCarSpacesValue = toNumberOrNull(minCarSpaces);
      const maxCarSpacesValue = toNumberOrNull(maxCarSpaces);

      if (
        minBedroomsValue !== null &&
        maxBedroomsValue !== null &&
        maxBedroomsValue < minBedroomsValue
      ) {
        return NextResponse.json(
          { success: false, message: "Maximum bedrooms cannot be lower than minimum bedrooms." },
          { status: 400 }
        );
      }

      if (
        minBathroomsValue !== null &&
        maxBathroomsValue !== null &&
        maxBathroomsValue < minBathroomsValue
      ) {
        return NextResponse.json(
          { success: false, message: "Maximum bathrooms cannot be lower than minimum bathrooms." },
          { status: 400 }
        );
      }

      if (
        minCarSpacesValue !== null &&
        maxCarSpacesValue !== null &&
        maxCarSpacesValue < minCarSpacesValue
      ) {
        return NextResponse.json(
          { success: false, message: "Maximum car spaces cannot be lower than minimum car spaces." },
          { status: 400 }
        );
      }
    }

    if (enquiryType === "developer") {
      if (
        !isNonEmptyString(projectName) ||
        !isNonEmptyString(projectLocation) ||
        !isNonEmptyString(commissionStructureInterest)
      ) {
        return NextResponse.json(
          { success: false, message: "Please fill in all required developer fields." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const enquiry = await Enquiry.create({
      enquiryType,
      name: name.trim(),
      email: email.trim(),
      phoneCountryCode: phoneCountryCode.trim(),
      phone: normalizedPhone,
      message: typeof message === "string" ? message.trim() : "",

      buyerType: typeof buyerType === "string" ? buyerType : "",
      investorRegion: typeof investorRegion === "string" ? investorRegion : "",
      minBudget: typeof minBudget === "string" ? minBudget : "",
      maxBudget: typeof maxBudget === "string" ? maxBudget : "",
      preferredLocations: typeof preferredLocations === "string" ? preferredLocations.trim() : "",
      propertyInterest: typeof propertyInterest === "string" ? propertyInterest : "",
      minBedrooms: typeof minBedrooms === "string" ? minBedrooms : "",
      maxBedrooms: typeof maxBedrooms === "string" ? maxBedrooms : "",
      minBathrooms: typeof minBathrooms === "string" ? minBathrooms : "",
      maxBathrooms: typeof maxBathrooms === "string" ? maxBathrooms : "",
      minCarSpaces: typeof minCarSpaces === "string" ? minCarSpaces : "",
      maxCarSpaces: typeof maxCarSpaces === "string" ? maxCarSpaces : "",
      propertyTypes: Array.isArray(propertyTypes) ? propertyTypes : [],
      keywords: typeof keywords === "string" ? keywords.trim() : "",

      projectName: typeof projectName === "string" ? projectName.trim() : "",
      projectLocation: typeof projectLocation === "string" ? projectLocation.trim() : "",
      commissionStructureInterest:
        typeof commissionStructureInterest === "string"
          ? commissionStructureInterest.trim()
          : "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        enquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting the form.",
      },
      { status: 500 }
    );
  }
}