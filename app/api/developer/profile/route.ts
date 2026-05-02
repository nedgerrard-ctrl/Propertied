import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^\+?[0-9]{6,20}$/;

function normalizePhone(value: string) {
  return value.replace(/\s|-/g, "").trim();
}

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "developer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email?.toLowerCase(),
  }).lean();

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    email: user.email,
    phone: user.phone ?? "",
    location: user.location ?? { type: "local", city: "" },
    userType: user.userType ?? "",
    companyName: user.companyName ?? "",
    abn: user.abn ?? "",
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "developer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const rawPhone = typeof body.phone === "string" ? body.phone : "";
  const phone = normalizePhone(rawPhone);
  const locationType = typeof body.locationType === "string" ? body.locationType : "";
  const locationCity = typeof body.locationCity === "string" ? body.locationCity.trim() : "";
  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
  const abn = typeof body.abn === "string" ? body.abn.trim() : "";

  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = "Name is required";
  } else if (name.length > 100) {
    fieldErrors.name = "Name is too long (max 100 characters)";
  } else if (!NAME_REGEX.test(name)) {
    fieldErrors.name = "Name can contain letters and spaces only";
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    fieldErrors.phone = "Enter a valid phone number";
  } else if (phone.length > 20) {
    fieldErrors.phone = "Phone number is too long";
  }

  if (!["local", "overseas"].includes(locationType)) {
    fieldErrors.locationType = "Select a valid location type";
  }

  if (locationCity.length > 100) {
    fieldErrors.locationCity = "City name is too long (max 100 characters)";
  }

  if (companyName.length > 150) {
    fieldErrors.companyName = "Company name is too long (max 150 characters)";
  }

  if (abn.length > 20) {
    fieldErrors.abn = "ABN is too long";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { message: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email?.toLowerCase() });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (phone && phone !== user.phone) {
    const existing = await User.findOne({ phone }).lean();
    if (existing) {
      return NextResponse.json(
        {
          message: "Please correct the highlighted fields.",
          fieldErrors: { phone: "This phone number is already in use" },
        },
        { status: 400 }
      );
    }
  }

  user.name = name;
  user.phone = phone || undefined;
  user.location = {
    type: locationType as "local" | "overseas",
    city: locationCity || undefined,
  };
  user.companyName = companyName || undefined;
  user.abn = abn || undefined;

  await user.save();

  return NextResponse.json({ success: true });
}
