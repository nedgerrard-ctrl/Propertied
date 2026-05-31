import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

const RECIPIENT_MAP: Record<string, string> = {
  sales: "sales@onlinepropertyservices.com.au",
  portfolio: "rental@onlinepropertyservices.com.au",
  developers: "admin@onlinepropertyservices.com.au",
  general: "admin@onlinepropertyservices.com.au",
};

const CATEGORY_LABELS: Record<string, string> = {
  sales: "Sales Enquiries",
  portfolio: "Portfolio Management",
  developers: "Developers",
  general: "General",
};

type FieldErrors = Record<string, string>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

function badRequest(message: string, fieldErrors?: FieldErrors) {
  return NextResponse.json(
    { success: false, message, fieldErrors: fieldErrors ?? {} },
    { status: 400 }
  );
}

function buildEmailHtml(params: {
  categoryLabel: string;
  name: string;
  email: string;
  phone: string;
  documentsRequested: string;
  message: string;
}) {
  const { categoryLabel, name, email, phone, documentsRequested, message } = params;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2923; max-width: 600px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #9a8f83; margin-bottom: 8px;">
        Online Property Services
      </p>
      <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 24px;">Document Request — ${categoryLabel}</h1>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tbody>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a8f83; width: 160px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a8f83;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 14px;"><a href="mailto:${email}" style="color: #2f2923;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a8f83;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 14px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a8f83;">Category</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e3d8ca; font-size: 14px;">${categoryLabel}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a8f83; margin-bottom: 8px;">Documents Requested</p>
      <p style="font-size: 14px; white-space: pre-wrap; background: #f6f2eb; padding: 16px; border-radius: 4px; margin: 0 0 24px;">${documentsRequested}</p>

      ${
        message.trim()
          ? `<p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a8f83; margin-bottom: 8px;">Additional Information</p>
      <p style="font-size: 14px; white-space: pre-wrap; background: #f6f2eb; padding: 16px; border-radius: 4px; margin: 0 0 24px;">${message}</p>`
          : ""
      }
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return badRequest("Unsupported request format.");
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return badRequest("Invalid request body.");
    }

    const category = String(body.category ?? "").trim();
    const name = String(body.name ?? "");
    const email = String(body.email ?? "");
    const phoneCountryCode = String(body.phoneCountryCode ?? "");
    const phone = String(body.phone ?? "");
    const documentsRequested = String(body.documentsRequested ?? "");
    const message = String(body.message ?? "");

    const fieldErrors: FieldErrors = {};

    if (!["sales", "portfolio", "developers", "general"].includes(category)) {
      fieldErrors.category = "Select an enquiry category";
    }

    if (!isNonEmptyString(name)) {
      fieldErrors.name = "Enter your full name";
    } else if (name.length > 100) {
      fieldErrors.name = "This field is too long";
    } else if (!NAME_REGEX.test(name.trim())) {
      fieldErrors.name = "Name can contain letters and spaces only";
    }

    if (!isNonEmptyString(email)) {
      fieldErrors.email = "Enter your email address";
    } else if (email.length > 120) {
      fieldErrors.email = "This field is too long";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      fieldErrors.email = "Enter a valid email address";
    }

    if (!isNonEmptyString(phoneCountryCode)) {
      fieldErrors.phoneCountryCode = "Select a country code";
    }

    const normalizedPhone = normalizePhone(phone);
    if (!isNonEmptyString(phone)) {
      fieldErrors.phone = "Enter your phone number";
    } else if (phone.length > 20) {
      fieldErrors.phone = "This field is too long";
    } else if (!PHONE_REGEX.test(normalizedPhone)) {
      fieldErrors.phone = "Enter a valid phone number";
    }

    if (!isNonEmptyString(documentsRequested)) {
      fieldErrors.documentsRequested = "Describe the documents you are requesting";
    } else if (documentsRequested.length > 1000) {
      fieldErrors.documentsRequested = "This field is too long";
    }

    if (message.length > 1000) {
      fieldErrors.message = "This field is too long";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return badRequest("Please correct the highlighted fields.", fieldErrors);
    }

    const recipientEmail = RECIPIENT_MAP[category];
    const categoryLabel = CATEGORY_LABELS[category];
    const fullPhone = `${phoneCountryCode.trim()} ${normalizedPhone}`.trim();

    await sendEmail({
      to: recipientEmail,
      subject: `Document Request — ${categoryLabel} — ${name.trim()}`,
      html: buildEmailHtml({
        categoryLabel,
        name: name.trim(),
        email: email.trim(),
        phone: fullPhone,
        documentsRequested: documentsRequested.trim(),
        message: message.trim(),
      }),
    });

    return NextResponse.json(
      { success: true, message: "Document request submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Document request error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while submitting your request.", fieldErrors: {} },
      { status: 500 }
    );
  }
}
