import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name:             { type: String, required: true },
    suburb:           { type: String, required: true },
    state:            { type: String, required: true, default: "VIC" },
    type:             { type: String, enum: ["Apartment", "Townhouse", "House"], required: true },
    propertyInterest: { type: String, enum: ["off-plan", "established"], required: true },
    status:           { type: String, enum: ["Current", "Upcoming"], required: true, default: "Current" },
    bedrooms:         { type: String, required: true },
    bathrooms:        { type: String, required: true },
    carSpaces:        { type: String, required: true },
    priceFrom:        { type: String, required: true },
    description:      { type: String, required: true },
    highlights:       [{ type: String }],
    image:            { type: String, default: "" },
    published:        { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
