import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

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

type SavedLegalDocument = {
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
};

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

function sanitizeFilename(name: string) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);

  const safeBase = base
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();

  return `${safeBase || "document"}${safeExt}`;
}

async function saveLegalDocument(file: File): Promise<SavedLegalDocument> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeOriginalName = sanitizeFilename(file.name);
  const uniquePrefix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const storedName = `${uniquePrefix}-${safeOriginalName}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "legal-documents"
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, storedName);
  await fs.writeFile(filePath, buffer);

  return {
    originalName: file.name,
    storedName,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: `/uploads/legal-documents/${storedName}`,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const enquiryType = String(formData.get("enquiryType") ?? "");
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phoneCountryCode = String(formData.get("phoneCountryCode") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");

    // buyer
    const buyerType = String(formData.get("buyerType") ?? "");
    const investorRegion = String(formData.get("investorRegion") ?? "");
    const minBudget = String(formData.get("minBudget") ?? "");
    const maxBudget = String(formData.get("maxBudget") ?? "");
    const preferredLocations = String(formData.get("preferredLocations") ?? "");
    const propertyInterest = String(formData.get("propertyInterest") ?? "");
    const minBedrooms = String(formData.get("minBedrooms") ?? "");
    const maxBedrooms = String(formData.get("maxBedrooms") ?? "");
    const minBathrooms = String(formData.get("minBathrooms") ?? "");
    const maxBathrooms = String(formData.get("maxBathrooms") ?? "");
    const minCarSpaces = String(formData.get("minCarSpaces") ?? "");
    const maxCarSpaces = String(formData.get("maxCarSpaces") ?? "");
    const propertyType = String(formData.get("propertyType") ?? "");
    const keywords = String(formData.get("keywords") ?? "");

    // developer
    const projectName = String(formData.get("projectName") ?? "");
    const projectLocation = String(formData.get("projectLocation") ?? "");
    const commissionStructureInterest = String(
      formData.get("commissionStructureInterest") ?? ""
    );

    const uploadedFiles = formData
      .getAll("legalDocuments")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (!["general", "developer", "buyer"].includes(enquiryType)) {
      return NextResponse.json(
        { success: false, message: "Invalid enquiry type." },
        { status: 400 }
      );
    }

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(phoneCountryCode) ||
      !isNonEmptyString(phone)
    ) {
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
      [propertyType, 100],
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
        {
          success: false,
          message: "One or more fields exceed the maximum allowed length.",
        },
        { status: 400 }
      );
    }

    if (uploadedFiles.length > MAX_DOCUMENTS) {
      return NextResponse.json(
        {
          success: false,
          message: `You can upload up to ${MAX_DOCUMENTS} legal documents.`,
        },
        { status: 400 }
      );
    }

    for (const file of uploadedFiles) {
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed.",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            message: "Each legal document must be 5MB or smaller.",
          },
          { status: 400 }
        );
      }

      if (!validateMaxLength(file.name, 200)) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more uploaded filenames are too long.",
          },
          { status: 400 }
        );
      }
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
          {
            success: false,
            message: "Please fill in all required buyer/investor fields.",
          },
          { status: 400 }
        );
      }

      const minBudgetValue = toNumberOrNull(minBudget);
      const maxBudgetValue = toNumberOrNull(maxBudget);

      if (
        minBudgetValue !== null &&
        maxBudgetValue !== null &&
        maxBudgetValue < minBudgetValue
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Maximum budget cannot be lower than minimum budget.",
          },
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
          {
            success: false,
            message: "Maximum bedrooms cannot be lower than minimum bedrooms.",
          },
          { status: 400 }
        );
      }

      if (
        minBathroomsValue !== null &&
        maxBathroomsValue !== null &&
        maxBathroomsValue < minBathroomsValue
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum bathrooms cannot be lower than minimum bathrooms.",
          },
          { status: 400 }
        );
      }

      if (
        minCarSpacesValue !== null &&
        maxCarSpacesValue !== null &&
        maxCarSpacesValue < minCarSpacesValue
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum car spaces cannot be lower than minimum car spaces.",
          },
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
          {
            success: false,
            message: "Please fill in all required developer fields.",
          },
          { status: 400 }
        );
      }
    }

    const savedLegalDocuments = await Promise.all(
      uploadedFiles.map((file) => saveLegalDocument(file))
    );

    await connectDB();

    const enquiry = await Enquiry.create({
      enquiryType,
      name: name.trim(),
      email: email.trim(),
      phoneCountryCode: phoneCountryCode.trim(),
      phone: normalizedPhone,
      message: message.trim(),

      buyerType,
      investorRegion,
      minBudget,
      maxBudget,
      preferredLocations: preferredLocations.trim(),
      propertyInterest,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minCarSpaces,
      maxCarSpaces,
      propertyType: propertyType.trim(),
      keywords: keywords.trim(),
      legalDocuments: savedLegalDocuments,

      projectName: projectName.trim(),
      projectLocation: projectLocation.trim(),
      commissionStructureInterest: commissionStructureInterest.trim(),
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