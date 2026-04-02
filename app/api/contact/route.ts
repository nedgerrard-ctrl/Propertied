import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      enquiryType,
      name,
      email,
      phone,
      message,
      budget,
      preferredLocation,
      propertyInterest,
      investorType,
      projectName,
      projectLocation,
      commissionStructureInterest,
    } = body;

    if (!enquiryType || !name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    if (!["general", "developer", "buyer"].includes(enquiryType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid enquiry type.",
        },
        { status: 400 }
      );
    }

    if (enquiryType === "buyer") {
      if (!budget || !preferredLocation || !propertyInterest || !investorType) {
        return NextResponse.json(
          {
            success: false,
            message: "Please fill in all required buyer/investor fields.",
          },
          { status: 400 }
        );
      }
    }

    if (enquiryType === "developer") {
      if (!projectName || !projectLocation || !commissionStructureInterest) {
        return NextResponse.json(
          {
            success: false,
            message: "Please fill in all required developer fields.",
          },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const enquiry = await Enquiry.create({
      enquiryType,
      name,
      email,
      phone,
      message: message || "",
      budget: budget || "",
      preferredLocation: preferredLocation || "",
      propertyInterest: propertyInterest || "",
      investorType: investorType || "",
      projectName: projectName || "",
      projectLocation: projectLocation || "",
      commissionStructureInterest: commissionStructureInterest || "",
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