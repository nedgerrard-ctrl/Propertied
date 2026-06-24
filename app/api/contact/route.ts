import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { submitEnquiryToAgentbox } from "@/lib/agentbox";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

function parseBody(raw: Record<string, unknown>) {
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  return {
    enquiryType: str("enquiryType") as "general" | "buyer",
    name: str("name"),
    email: str("email").toLowerCase(),
    phoneCountryCode: str("phoneCountryCode"),
    phone: normalizePhone(str("phone")),
    iAm: str("iAm"),
    howDidYouHear: str("howDidYouHear"),
    message: str("message"),
    // buyer fields
    buyerType: str("buyerType") as "owner-occupier" | "investor" | "",
    investorRegion: str("investorRegion") as "local" | "overseas" | "",
    minBudget: str("minBudget"),
    maxBudget: str("maxBudget"),
    preferredLocations: str("preferredLocations"),
    propertyInterest: str("propertyInterest") as "off-plan" | "established" | "",
    minBedrooms: str("minBedrooms"),
    maxBedrooms: str("maxBedrooms"),
    minBathrooms: str("minBathrooms"),
    maxBathrooms: str("maxBathrooms"),
    minCarSpaces: str("minCarSpaces"),
    maxCarSpaces: str("maxCarSpaces"),
    propertyType: str("propertyType"),
    keywords: str("keywords"),
    listingId: str("listingId"),
  };
}

export async function POST(req: NextRequest) {
  let raw: Record<string, unknown> = {};

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
    }
  } else if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        raw[key] = value;
      }
    } catch {
      return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
    }
  } else {
    return NextResponse.json({ message: "Unsupported content type." }, { status: 415 });
  }

  const body = parseBody(raw);

  // --- Validate common fields ---
  const fieldErrors: Record<string, string> = {};

  if (!body.name) {
    fieldErrors.name = "Enter your full name";
  } else if (body.name.length > 100) {
    fieldErrors.name = "This field is too long";
  } else if (!NAME_REGEX.test(body.name)) {
    fieldErrors.name = "Name can contain letters and spaces only";
  }

  if (!body.email) {
    fieldErrors.email = "Enter your email address";
  } else if (!EMAIL_REGEX.test(body.email)) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (!body.phoneCountryCode) {
    fieldErrors.phoneCountryCode = "Select a country code";
  }

  if (!body.phone) {
    fieldErrors.phone = "Enter your phone number";
  } else if (!PHONE_REGEX.test(body.phone)) {
    fieldErrors.phone = "Enter a valid phone number";
  }

  // --- Validate buyer-specific required fields ---
  if (body.enquiryType === "buyer") {
    if (!body.buyerType) fieldErrors.buyerType = "Select buyer type";
    if (!body.investorRegion) fieldErrors.investorRegion = "Select investor region";
    if (!body.minBudget) fieldErrors.minBudget = "Select a minimum budget";
    if (!body.maxBudget) fieldErrors.maxBudget = "Select a maximum budget";
    if (!body.preferredLocations) fieldErrors.preferredLocations = "Enter preferred locations";
    if (!body.propertyInterest) fieldErrors.propertyInterest = "Select property interest";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  // --- Save to MongoDB ---
  try {
    await connectDB();

    const enquiryDoc = await Enquiry.create({
      enquiryType: body.enquiryType || "general",
      name: body.name,
      email: body.email,
      phoneCountryCode: body.phoneCountryCode,
      phone: body.phone,
      message: body.message,
      // buyer fields (harmless if empty on general)
      buyerType: body.buyerType || "",
      investorRegion: body.investorRegion || "",
      minBudget: body.minBudget || "",
      maxBudget: body.maxBudget || "",
      preferredLocations: body.preferredLocations || "",
      propertyInterest: body.propertyInterest || "",
      minBedrooms: body.minBedrooms || "",
      maxBedrooms: body.maxBedrooms || "",
      minBathrooms: body.minBathrooms || "",
      maxBathrooms: body.maxBathrooms || "",
      minCarSpaces: body.minCarSpaces || "",
      maxCarSpaces: body.maxCarSpaces || "",
      propertyType: body.propertyType || "",
      keywords: body.keywords || "",
      listingId: body.listingId || "",
      status: "pending",
    });

    // --- Submit to Agentbox CRM (non-blocking) ---
    const { firstName, lastName } = splitName(body.name);

    const agentboxComment = buildAgentboxComment(body);

    submitEnquiryToAgentbox({
      firstName,
      lastName,
      email: body.email,
      mobile: `${body.phoneCountryCode}${body.phone}`,
      comment: agentboxComment,
      listingId: body.listingId || undefined,
    })
      .then((agentboxId) => {
        if (agentboxId) {
          Enquiry.findByIdAndUpdate(enquiryDoc._id, {
            agentboxEnquiryId: agentboxId,
          }).catch(console.error);
        }
      })
      .catch(console.error);

    return NextResponse.json(
      { message: "Enquiry submitted successfully.", id: enquiryDoc._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving enquiry:", error);
    return NextResponse.json(
      { message: "Failed to submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}

function buildAgentboxComment(body: ReturnType<typeof parseBody>): string {
  const lines: string[] = [];

  if (body.enquiryType === "buyer") {
    lines.push("PPM Website — Buyer/Investor Enquiry");
    if (body.buyerType) lines.push(`Buyer type: ${body.buyerType}`);
    if (body.investorRegion) lines.push(`Region: ${body.investorRegion}`);
    if (body.preferredLocations) lines.push(`Preferred locations: ${body.preferredLocations}`);
    if (body.propertyInterest) lines.push(`Property interest: ${body.propertyInterest}`);
    if (body.minBudget && body.maxBudget) {
      lines.push(`Budget: $${Number(body.minBudget).toLocaleString()} – $${Number(body.maxBudget).toLocaleString()}`);
    }
    if (body.propertyType) lines.push(`Property type: ${body.propertyType}`);
    if (body.minBedrooms || body.maxBedrooms) {
      lines.push(`Bedrooms: ${body.minBedrooms || "any"} – ${body.maxBedrooms || "any"}`);
    }
    if (body.keywords) lines.push(`Keywords: ${body.keywords}`);
  } else {
    lines.push("PPM Website — General Enquiry");
    if (body.iAm) lines.push(`I am a: ${body.iAm}`);
    if (body.howDidYouHear) lines.push(`How they heard: ${body.howDidYouHear}`);
  }

  if (body.message) {
    lines.push("");
    lines.push(body.message);
  }

  return lines.join("\n");
}
