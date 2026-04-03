import mongoose, { Schema, models, model } from "mongoose";

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
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
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
    },

    propertyInterest: {
      type: String,
      enum: ["off-plan", "established", ""],
      default: "",
    },

    bedrooms: {
      type: String,
      trim: true,
      default: "",
    },

    bedroomRange: {
      type: Boolean,
      default: false,
    },

    bathrooms: {
      type: String,
      trim: true,
      default: "",
    },

    carSpaces: {
      type: String,
      trim: true,
      default: "",
    },

    minLandSize: {
      type: String,
      trim: true,
      default: "",
    },

    maxLandSize: {
      type: String,
      trim: true,
      default: "",
    },

    propertyTypes: {
      type: [String],
      default: [],
    },

    keywords: {
      type: String,
      trim: true,
      default: "",
    },

    // developer fields
    projectName: {
      type: String,
      trim: true,
      default: "",
    },

    projectLocation: {
      type: String,
      trim: true,
      default: "",
    },

    commissionStructureInterest: {
      type: String,
      trim: true,
      default: "",
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