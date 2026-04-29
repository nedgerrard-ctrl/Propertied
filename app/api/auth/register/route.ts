import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isValidPassword } from "@/lib/password-validation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const NAME_REGEX = /^[A-Za-z\s'-]+$/;

function normalizePhone(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s|-/g, "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const clientType =
      typeof body.clientType === "string" ? body.clientType : "";
    const companyName =
      typeof body.companyName === "string" ? body.companyName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const phoneCountryCode =
      typeof body.phoneCountryCode === "string"
        ? body.phoneCountryCode.trim()
        : "";
    const isExistingClient = body.isExistingClient === true;

    const fieldErrors: Record<string, string> = {};

    if (!name) {
      fieldErrors.name = "Enter your full name";
    } else if (!NAME_REGEX.test(name)) {
      fieldErrors.name = "Name can contain letters, spaces, hyphens, and apostrophes only";
    } else if (name.length > 100) {
      fieldErrors.name = "Name is too long";
    }

    if (!email) {
      fieldErrors.email = "Enter your email address";
    } else if (!EMAIL_REGEX.test(email)) {
      fieldErrors.email = "Enter a valid email address";
    } else if (email.length > 120) {
      fieldErrors.email = "Email address is too long";
    }

    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      if (!PHONE_REGEX.test(normalizedPhone)) {
        fieldErrors.phone = "Enter a valid phone number (digits only, 6–15 digits)";
      }
      if (phoneCountryCode && phoneCountryCode.length > 6) {
        fieldErrors.phoneCountryCode = "Invalid country code";
      }
    }

    if (!clientType || !["buyer", "investor", "developer"].includes(clientType)) {
      fieldErrors.clientType = "Select your account type";
    }

    if (clientType === "developer" && companyName && companyName.length > 120) {
      fieldErrors.companyName = "Company name is too long (max 120 characters)";
    }

    if (!password) {
      fieldErrors.password = "Enter a password";
    } else if (!isValidPassword(password)) {
      fieldErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Confirm your password";
    } else if (password && confirmPassword !== password) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          fieldErrors: { email: "An account with this email already exists" },
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedPhone = phone ? normalizePhone(phone) : "";

    await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "client",
      clientType,
      companyName: clientType === "developer" ? companyName : "",
      accountStatus: isExistingClient && clientType !== "developer"
        ? "pending-existing-client"
        : "active",
      phone: normalizedPhone,
      phoneCountryCode,
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
