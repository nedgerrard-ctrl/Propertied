import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

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

type FieldErrors = Record<string, string>;

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


async function saveLegalDocument(file: File): Promise<SavedLegalDocument> {
  const bytes = await file.arrayBuffer();
  const b64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "ppm/legal-documents",
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
  });

  return {
    originalName: file.name,
    storedName: result.public_id,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: result.secure_url,
  };
}

function badRequest(message: string, fieldErrors?: FieldErrors) {
  return NextResponse.json(
    {
      success: false,
      message,
      fieldErrors: fieldErrors ?? {},
    },
    { status: 400 }
  );
}

function getStringRecordFromJson(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }

  return body as Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const isJson = contentType.includes("application/json");

    let enquiryType = "";
    let name = "";
    let email = "";
    let phoneCountryCode = "";
    let phone = "";
    let message = "";

    // buyer
    let buyerType = "";
    let investorRegion = "";
    let minBudget = "";
    let maxBudget = "";
    let preferredLocations = "";
    let propertyInterest = "";
    let minBedrooms = "";
    let maxBedrooms = "";
    let minBathrooms = "";
    let maxBathrooms = "";
    let minCarSpaces = "";
    let maxCarSpaces = "";
    let propertyType = "";
    let keywords = "";

    // developer
    let projectName = "";
    let projectLocation = "";
    let commissionStructureInterest = "";

    let uploadedFiles: File[] = [];

    if (isMultipart) {
      const formData = await request.formData();

      enquiryType = String(formData.get("enquiryType") ?? "");
      name = String(formData.get("name") ?? "");
      email = String(formData.get("email") ?? "");
      phoneCountryCode = String(formData.get("phoneCountryCode") ?? "");
      phone = String(formData.get("phone") ?? "");
      message = String(formData.get("message") ?? "");

      buyerType = String(formData.get("buyerType") ?? "");
      investorRegion = String(formData.get("investorRegion") ?? "");
      minBudget = String(formData.get("minBudget") ?? "");
      maxBudget = String(formData.get("maxBudget") ?? "");
      preferredLocations = String(formData.get("preferredLocations") ?? "");
      propertyInterest = String(formData.get("propertyInterest") ?? "");
      minBedrooms = String(formData.get("minBedrooms") ?? "");
      maxBedrooms = String(formData.get("maxBedrooms") ?? "");
      minBathrooms = String(formData.get("minBathrooms") ?? "");
      maxBathrooms = String(formData.get("maxBathrooms") ?? "");
      minCarSpaces = String(formData.get("minCarSpaces") ?? "");
      maxCarSpaces = String(formData.get("maxCarSpaces") ?? "");
      propertyType = String(formData.get("propertyType") ?? "");
      keywords = String(formData.get("keywords") ?? "");

      projectName = String(formData.get("projectName") ?? "");
      projectLocation = String(formData.get("projectLocation") ?? "");
      commissionStructureInterest = String(
        formData.get("commissionStructureInterest") ?? ""
      );

      uploadedFiles = formData
        .getAll("legalDocuments")
        .filter((item): item is File => item instanceof File && item.size > 0);
    } else if (isJson) {
      const body = getStringRecordFromJson(await request.json());

      enquiryType = String(body.enquiryType ?? "");
      name = String(body.name ?? "");
      email = String(body.email ?? "");
      phoneCountryCode = String(body.phoneCountryCode ?? "");
      phone = String(body.phone ?? "");
      message = String(body.message ?? "");

      buyerType = String(body.buyerType ?? "");
      investorRegion = String(body.investorRegion ?? "");
      minBudget = String(body.minBudget ?? "");
      maxBudget = String(body.maxBudget ?? "");
      preferredLocations = String(body.preferredLocations ?? "");
      propertyInterest = String(body.propertyInterest ?? "");
      minBedrooms = String(body.minBedrooms ?? "");
      maxBedrooms = String(body.maxBedrooms ?? "");
      minBathrooms = String(body.minBathrooms ?? "");
      maxBathrooms = String(body.maxBathrooms ?? "");
      minCarSpaces = String(body.minCarSpaces ?? "");
      maxCarSpaces = String(body.maxCarSpaces ?? "");
      propertyType = String(body.propertyType ?? "");
      keywords = String(body.keywords ?? "");

      projectName = String(body.projectName ?? "");
      projectLocation = String(body.projectLocation ?? "");
      commissionStructureInterest = String(
        body.commissionStructureInterest ?? ""
      );

      uploadedFiles = [];
    } else {
      return badRequest("Unsupported request format.");
    }

    if (!["general", "developer", "buyer"].includes(enquiryType)) {
      return badRequest("Invalid enquiry type.");
    }

    const fieldErrors: FieldErrors = {};

    if (!isNonEmptyString(name)) {
      fieldErrors.name = "Enter your full name";
    }

    if (!isNonEmptyString(phoneCountryCode)) {
      fieldErrors.phoneCountryCode = "Select a country code";
    }

    if (!isNonEmptyString(phone)) {
      fieldErrors.phone = "Enter your phone number";
    }

    if (!isNonEmptyString(email)) {
      fieldErrors.email = "Enter your email address";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return badRequest("Please correct the highlighted fields.", fieldErrors);
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return badRequest("Please correct the highlighted fields.", {
        email: "Enter a valid email address",
      });
    }

    const normalizedPhone = normalizePhone(phone);

    if (!PHONE_REGEX.test(normalizedPhone)) {
      return badRequest("Please correct the highlighted fields.", {
        phone: "Enter a valid phone number",
      });
    }

    const maxLengthChecks = [
      [name, 100, "name"],
      [email, 120, "email"],
      [phoneCountryCode, 6, "phoneCountryCode"],
      [phone, 20, "phone"],
      [message, 1000, "message"],
      [preferredLocations, 150, "preferredLocations"],
      [propertyType, 100, "propertyType"],
      [keywords, 300, "keywords"],
      [projectName, 120, "projectName"],
      [projectLocation, 120, "projectLocation"],
      [commissionStructureInterest, 150, "commissionStructureInterest"],
    ] as const;

    for (const [value, max, key] of maxLengthChecks) {
      if (!validateMaxLength(value, max)) {
        return badRequest("Please correct the highlighted fields.", {
          [key]: "This field is too long",
        });
      }
    }

    if (uploadedFiles.length > MAX_DOCUMENTS) {
      return badRequest(`You can upload up to ${MAX_DOCUMENTS} legal documents.`, {
        legalDocuments: `Upload up to ${MAX_DOCUMENTS} files only`,
      });
    }

    for (const file of uploadedFiles) {
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        return badRequest("Only PDF, DOC, DOCX, JPG, and PNG files are allowed.", {
          legalDocuments: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed",
        });
      }

      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        return badRequest("Each legal document must be 5MB or smaller.", {
          legalDocuments: "Each file must be 5MB or smaller",
        });
      }

      if (!validateMaxLength(file.name, 200)) {
        return badRequest("One or more uploaded filenames are too long.", {
          legalDocuments: "One or more uploaded filenames are too long",
        });
      }
    }

    if (enquiryType === "buyer") {
      const buyerFieldErrors: FieldErrors = {};

      if (!isNonEmptyString(buyerType)) {
        buyerFieldErrors.buyerType = "Select buyer type";
      }

      if (!isNonEmptyString(investorRegion)) {
        buyerFieldErrors.investorRegion = "Select investor region";
      }

      if (!isNonEmptyString(minBudget)) {
        buyerFieldErrors.minBudget = "Select a minimum budget";
      }

      if (!isNonEmptyString(maxBudget)) {
        buyerFieldErrors.maxBudget = "Select a maximum budget";
      }

      if (!isNonEmptyString(preferredLocations)) {
        buyerFieldErrors.preferredLocations = "Enter preferred locations";
      }

      if (!isNonEmptyString(propertyInterest)) {
        buyerFieldErrors.propertyInterest = "Select property interest";
      }

      if (!isNonEmptyString(propertyType)) {
        buyerFieldErrors.propertyType = "Select a property type";
      }

      if (Object.keys(buyerFieldErrors).length > 0) {
        return badRequest(
          "Please correct the highlighted buyer/investor fields.",
          buyerFieldErrors
        );
      }

      const minBudgetValue = toNumberOrNull(minBudget);
      const maxBudgetValue = toNumberOrNull(maxBudget);

      if (
        minBudgetValue !== null &&
        maxBudgetValue !== null &&
        maxBudgetValue < minBudgetValue
      ) {
        return badRequest("Please correct the highlighted fields.", {
          maxBudget: "Maximum budget cannot be lower than minimum budget",
        });
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
        return badRequest("Please correct the highlighted fields.", {
          maxBedrooms: "Maximum bedrooms cannot be lower than minimum bedrooms",
        });
      }

      if (
        minBathroomsValue !== null &&
        maxBathroomsValue !== null &&
        maxBathroomsValue < minBathroomsValue
      ) {
        return badRequest("Please correct the highlighted fields.", {
          maxBathrooms: "Maximum bathrooms cannot be lower than minimum bathrooms",
        });
      }

      if (
        minCarSpacesValue !== null &&
        maxCarSpacesValue !== null &&
        maxCarSpacesValue < minCarSpacesValue
      ) {
        return badRequest("Please correct the highlighted fields.", {
          maxCarSpaces: "Maximum car spaces cannot be lower than minimum car spaces",
        });
      }
    }
    if (!isNonEmptyString(name)) {
  fieldErrors.name = "Enter your full name";
} else if (!NAME_REGEX.test(name.trim())) {
  fieldErrors.name = "Name can contain letters and spaces only";
}
    if (enquiryType === "developer") {
      const developerFieldErrors: FieldErrors = {};

      if (!isNonEmptyString(projectName)) {
        developerFieldErrors.projectName = "Enter the project name";
      }

      if (!isNonEmptyString(projectLocation)) {
        developerFieldErrors.projectLocation = "Enter the project location";
      }

      if (!isNonEmptyString(commissionStructureInterest)) {
        developerFieldErrors.commissionStructureInterest =
          "Enter your commission structure interest";
      }

      if (Object.keys(developerFieldErrors).length > 0) {
        return badRequest(
          "Please correct the highlighted developer fields.",
          developerFieldErrors
        );
      }
    }

    const savedLegalDocuments = await Promise.all(
      uploadedFiles.map((file) => saveLegalDocument(file))
    );

    await connectDB();

    const matchClause = {
      $or: [
        { email: email.trim().toLowerCase() },
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    };

    if (enquiryType === "developer") {
      const submitter = await User.findOne(matchClause).lean();
      const isBlocked =
        submitter?.userType === "buyer_investor" ||
        submitter?.userType === "existing_client";

      if (isBlocked) {
        return NextResponse.json(
          {
            success: false,
            message: "You are not permitted to submit developer enquiries.",
            fieldErrors: {},
          },
          { status: 403 }
        );
      }
    }

    if (enquiryType === "buyer") {
      const submitter = await User.findOne(matchClause).lean();
      if (submitter?.userType === "developer") {
        return NextResponse.json(
          {
            success: false,
            message: "As a developer, you are not permitted to submit buyer or investor enquiries.",
            fieldErrors: {},
          },
          { status: 403 }
        );
      }
    }

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
        fieldErrors: {},
      },
      { status: 500 }
    );
  }
}