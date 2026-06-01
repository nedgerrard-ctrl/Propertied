import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { isValidPassword, PASSWORD_REQUIREMENTS_MESSAGE } from "@/lib/password-validation";

type FieldErrors = Record<string, string>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone);
}

function isValidABN(abn: string) {
  return /^\d{11}$/.test(abn.replace(/\s/g, ""));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      clientType,
      phone,
      locationKind,
      city,
      companyName,
      abn,
      verificationCode,
    } = body;

    const fieldErrors: FieldErrors = {};

    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      fieldErrors.firstName = "First name is required.";
    }

    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      fieldErrors.lastName = "Last name is required.";
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      fieldErrors.email = "Email address is required.";
    } else if (!isValidEmail(email.trim())) {
      fieldErrors.email = "Please enter a valid email address.";
    }

    if (!password || typeof password !== "string") {
      fieldErrors.password = "Password is required.";
    } else if (!isValidPassword(password)) {
      fieldErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
    }

    if (!confirmPassword || typeof confirmPassword !== "string") {
      fieldErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }

    if (!userType || !["buyer_investor", "developer", "existing_client"].includes(userType)) {
      fieldErrors.userType = "Please select a role.";
    }

    if (userType === "buyer_investor") {
      if (!clientType || !["investor", "owner-occupier"].includes(clientType)) {
        fieldErrors.clientType = "Please select whether you are an investor or owner-occupier.";
      }
    }

    if (!locationKind || !["local", "overseas"].includes(locationKind)) {
      fieldErrors.locationKind = "Please select your location.";
    } else if (locationKind === "local" && (!city || !city.trim())) {
      fieldErrors.city = "Please select your city.";
    }

    if (phone && typeof phone === "string" && phone.trim()) {
      if (!isValidPhone(phone.trim())) {
        fieldErrors.phone = "Please enter a valid phone number.";
      }
    }

    if (userType === "developer") {
      if (abn && typeof abn === "string" && abn.trim()) {
        if (!isValidABN(abn.trim())) {
          fieldErrors.abn = "ABN must be 11 digits.";
        }
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ message: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return NextResponse.json(
        { message: "Please correct the highlighted fields.", fieldErrors: { email: "An account with this email already exists." } },
        { status: 409 }
      );
    }

    const trimmedPhone = phone?.trim() || undefined;
    if (trimmedPhone) {
      const existingPhone = await User.findOne({ phone: trimmedPhone });
      if (existingPhone) {
        return NextResponse.json(
          { message: "Please correct the highlighted fields.", fieldErrors: { phone: "This phone number is already registered." } },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const isExistingClient = userType === "existing_client";

    const userData: Record<string, unknown> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: normalizedEmail,
      passwordHash,
      role: "client",
      userType,
      accountStatus: isExistingClient ? "pending-existing-client" : "active",
      phone: trimmedPhone,
      location: {
        type: locationKind,
        city: locationKind === "local" ? city.trim() : undefined,
      },
      pendingApproval: isExistingClient,
    };

    if (userType === "buyer_investor") {
      userData.clientType = clientType;
    }

    if (userType === "developer") {
      if (companyName?.trim()) userData.companyName = companyName.trim();
      if (abn?.trim()) userData.abn = abn.replace(/\s/g, "");
    }

    // Verify OTP code
    if (!verificationCode || typeof verificationCode !== "string" || verificationCode.trim().length !== 6) {
      return NextResponse.json(
        { message: "Please enter the 6-digit code sent to your email.", fieldErrors: { verificationCode: "Please enter your verification code." } },
        { status: 400 }
      );
    }

    const storedCode = await VerificationCode.findOne({
      email: normalizedEmail,
      expiresAt: { $gt: new Date() },
    });

    if (!storedCode) {
      return NextResponse.json(
        { message: "Verification code has expired or was not found. Please request a new one.", fieldErrors: { verificationCode: "Code expired. Please request a new one." } },
        { status: 400 }
      );
    }

    const codeMatch = await bcrypt.compare(verificationCode.trim(), storedCode.codeHash);
    if (!codeMatch) {
      return NextResponse.json(
        { message: "Incorrect verification code.", fieldErrors: { verificationCode: "Incorrect code. Please try again." } },
        { status: 400 }
      );
    }

    userData.emailVerified = true;

    await User.create(userData);
    await VerificationCode.deleteMany({ email: normalizedEmail });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
