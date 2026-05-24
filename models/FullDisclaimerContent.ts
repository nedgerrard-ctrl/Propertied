import { Schema, model, models } from "mongoose";

const FullDisclaimerContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },

    // Body paragraphs
    para1: { type: String, default: "" },
    para2: { type: String, default: "" },
    para3: { type: String, default: "" },
    para4: { type: String, default: "" },

    // Licence line
    licenceLine: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).FullDisclaimerContent;
}

export default models.FullDisclaimerContent ||
  model("FullDisclaimerContent", FullDisclaimerContentSchema);
