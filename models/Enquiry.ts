import mongoose, { Schema, models, model } from "mongoose";

const enquirySchema = new Schema(
  {
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
    propertyInterest: {
      type: String,
      required: true,
      enum: ["off-plan", "established"],
    },
    investorType: {
      type: String,
      required: true,
      enum: ["local", "overseas"],
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = models.Enquiry || model("Enquiry", enquirySchema);

export default Enquiry;