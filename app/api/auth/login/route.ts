import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string" ? body.email.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    const fieldErrors: Record<string, string> = {};

    if (!email) {
      fieldErrors.email = "Enter your email address";
    } else if (!EMAIL_REGEX.test(email)) {
      fieldErrors.email = "Enter a valid email address";
    }

    if (!password) {
      fieldErrors.password = "Enter a password";
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

    return NextResponse.json(
      {
        success: true,
        message: "Validation passed.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request.",
        fieldErrors: {},
      },
      { status: 400 }
    );
  }
}