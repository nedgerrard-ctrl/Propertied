import { Schema, models, model } from "mongoose";

const legalDocumentSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    storedName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const enquirySchema = new Schema(
  {
    enquiryType: {
      type: String,
      required: true,
      enum: ["general", "developer", "buyer"],
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },

    phoneCountryCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 6,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    buyerType: {
      type: String,
      enum: ["owner-occupier", "investor", ""],
      default: "",
    },

    investorRegion: {
      type: String,
      enum: ["local", "overseas", ""],
      default: "",
    },

    minBudget: {
      type: String,
      trim: true,
      default: "",
    },

    maxBudget: {
      type: String,
      trim: true,
      default: "",
    },

    preferredLocations: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    propertyInterest: {
      type: String,
      enum: ["off-plan", "established", ""],
      default: "",
    },

    minBedrooms: {
      type: String,
      trim: true,
      default: "",
    },

    maxBedrooms: {
      type: String,
      trim: true,
      default: "",
    },

    minBathrooms: {
      type: String,
      trim: true,
      default: "",
    },

    maxBathrooms: {
      type: String,
      trim: true,
      default: "",
    },

    minCarSpaces: {
      type: String,
      trim: true,
      default: "",
    },

    maxCarSpaces: {
      type: String,
      trim: true,
      default: "",
    },

    propertyType: {
      type: String,
      trim: true,
      default: "",
    },

    keywords: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },

    legalDocuments: {
      type: [legalDocumentSchema],
      default: [],
    },

    projectName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },

    projectLocation: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },

    commissionStructureInterest: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    status: {
      type: String,
      enum: ["pending", "qualified", "in-progress", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = models.Enquiry || model("Enquiry", enquirySchema);

export default Enquiry;