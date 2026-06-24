import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { isValidPassword } from "@/lib/password-validation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const str = (key: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  const firstName = str("firstName");
  const lastName = str("lastName");
  const email = str("email").toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  const userType = str("userType") as "buyer_investor" | "developer" | "existing_client" | "";
  const clientType = str("clientType") as "investor" | "owner-occupier" | "";
  const phone = str("phone");
  const locationKind = str("locationKind") as "local" | "overseas" | "";
  const city = str("city");
  const companyName = str("companyName");
  const abn = str("abn");
  const verificationCode = str("verificationCode").replace(/\D/g, "");

  const fieldErrors: Record<string, string> = {};

  if (!firstName) fieldErrors.firstName = "First name is required.";
  if (!lastName) fieldErrors.lastName = "Last name is required.";

  if (!email) {
    fieldErrors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Password is required.";
  } else if (!isValidPassword(password)) {
    fieldErrors.password = "Password does not meet the requirements.";
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm your password.";
  } else if (confirmPassword !== password) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (!locationKind) fieldErrors.locationKind = "Please select your location.";

  if (!verificationCode || verificationCode.length !== 6) {
    fieldErrors.verificationCode = "Please enter the 6-digit verification code.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  try {
    await connectDB();

    // Check email uniqueness
    const existingUser = await User.findOne({ email, isDeleted: { $ne: true } }).lean();
    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
          fieldErrors: { email: "An account with this email already exists." },
        },
        { status: 409 }
      );
    }

    // Verify OTP code
    const codeRecord = await VerificationCode.findOne({ email });

    if (!codeRecord) {
      return NextResponse.json(
        { message: "Verification code expired or not found. Please request a new code." },
        { status: 400 }
      );
    }

    if (codeRecord.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ email });
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    const codeValid = await bcrypt.compare(verificationCode, codeRecord.codeHash);
    if (!codeValid) {
      return NextResponse.json(
        {
          message: "Invalid verification code.",
          fieldErrors: { verificationCode: "Invalid verification code." },
        },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    await User.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      passwordHash,
      role: "client",
      userType: userType || "buyer_investor",
      clientType: clientType || "",
      phone: phone || "",
      location: {
        type: locationKind || "local",
        city: locationKind === "local" ? city : "",
      },
      companyName: companyName || "",
      abn: abn || "",
      accountStatus: "pending-existing-client",
      emailVerified: true, // code verified above
      pendingApproval: true,
    });

    // Clean up verification code
    await VerificationCode.deleteOne({ email });

    return NextResponse.json(
      {
        message:
          "Account created successfully. Your account is pending approval — you will be notified by email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
