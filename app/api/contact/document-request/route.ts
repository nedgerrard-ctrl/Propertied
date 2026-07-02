import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const str = (key: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  const category = str("category");
  const name = str("name");
  const email = str("email").toLowerCase();
  const phoneCountryCode = str("phoneCountryCode");
  const phone = normalizePhone(str("phone"));
  const documentsRequested = str("documentsRequested");
  const message = str("message");

  const fieldErrors: Record<string, string> = {};

  if (!category) fieldErrors.category = "Select an enquiry category";

  if (!name) {
    fieldErrors.name = "Enter your full name";
  } else if (name.length > 100) {
    fieldErrors.name = "This field is too long";
  } else if (!NAME_REGEX.test(name)) {
    fieldErrors.name = "Name can contain letters and spaces only";
  }

  if (!email) {
    fieldErrors.email = "Enter your email address";
  } else if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (!phoneCountryCode) fieldErrors.phoneCountryCode = "Select a country code";

  if (!phone) {
    fieldErrors.phone = "Enter your phone number";
  } else if (!PHONE_REGEX.test(phone)) {
    fieldErrors.phone = "Enter a valid phone number";
  }

  if (!documentsRequested) {
    fieldErrors.documentsRequested = "Describe the documents you are requesting";
  } else if (documentsRequested.length > 1000) {
    fieldErrors.documentsRequested = "This field is too long";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    await Enquiry.create({
      enquiryType: "document-request",
      name,
      email,
      phoneCountryCode,
      phone,
      message: [
        `Document Request — Category: ${category}`,
        `Documents requested: ${documentsRequested}`,
        message ? `\nAdditional info: ${message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      status: "pending",
    });

    return NextResponse.json(
      { message: "Document request submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving document request:", error);
    return NextResponse.json(
      { message: "Failed to submit request. Please try again." },
      { status: 500 }
    );
  }
}
