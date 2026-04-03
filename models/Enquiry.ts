import { Schema, models, model } from "mongoose";

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

    // buyer / investor fields
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

    propertyTypes: {
      type: String,
      default: "",
    },

    keywords: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },

    // developer fields
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
      enum: ["qualified", "in-progress", "closed"],
      default: "qualified",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = models.Enquiry || model("Enquiry", enquirySchema);

export default Enquiry;