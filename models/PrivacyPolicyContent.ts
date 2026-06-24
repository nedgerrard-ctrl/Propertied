import { Schema, model, models } from "mongoose";

const PrivacyPolicyContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },

    // Legacy section fields (kept for DB compatibility)
    section1Heading: { type: String, default: "" },
    section1Body:    { type: String, default: "" },
    section2Heading: { type: String, default: "" },
    section2Body:    { type: String, default: "" },
    section3Heading: { type: String, default: "" },
    section3Body:    { type: String, default: "" },
    section4Heading: { type: String, default: "" },
    section4Body:    { type: String, default: "" },
    section5Heading: { type: String, default: "" },
    section5Body:    { type: String, default: "" },
    section6Heading: { type: String, default: "" },
    section6Body:    { type: String, default: "" },
    section7Heading: { type: String, default: "" },
    section7Body:    { type: String, default: "" },

    // Per-element text overrides for the 19-section body
    sectionOverrides: { type: Object, default: {} },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).PrivacyPolicyContent;
}

export default models.PrivacyPolicyContent ||
  model("PrivacyPolicyContent", PrivacyPolicyContentSchema);
