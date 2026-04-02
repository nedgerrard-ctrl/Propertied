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
    budget: {
      type: String,
      trim: true,
      default: "",
    },
    preferredLocation: {
      type: String,
      trim: true,
      default: "",
    },
    propertyInterest: {
      type: String,
      enum: ["off-plan", "established", ""],
      default: "",
    },
    investorType: {
      type: String,
      enum: ["local", "overseas", ""],
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