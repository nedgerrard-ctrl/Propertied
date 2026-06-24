import { Schema, model, models } from "mongoose";

const InsightsContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },

    // Section 1
    section1Heading: { type: String, default: "" },
    section1Body:    { type: String, default: "" },

    // Section 2
    section2Heading: { type: String, default: "" },
    section2Body:    { type: String, default: "" },

    // Section 3
    section3Heading: { type: String, default: "" },
    section3Body:    { type: String, default: "" },

    // Section 4
    section4Heading: { type: String, default: "" },
    section4Body1:   { type: String, default: "" },
    section4Body2:   { type: String, default: "" },

    // Disclaimer
    disclaimer: { type: String, default: "" },

    // Links
    link1Label: { type: String, default: "" },
    link1Url:   { type: String, default: "" },
    link2Label: { type: String, default: "" },
    link2Url:   { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).InsightsContent;
}

export default models.InsightsContent || model("InsightsContent", InsightsContentSchema);
