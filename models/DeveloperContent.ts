import { Schema, model, models } from "mongoose";

const DeveloperContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain: { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext: { type: String, default: "" },

    // Network section
    networkHeadingMain: { type: String, default: "" },
    networkHeadingAccent: { type: String, default: "" },
    networkP1: { type: String, default: "" },
    networkP2: { type: String, default: "" },
    networkP3: { type: String, default: "" },
    networkBullet1: { type: String, default: "" },
    networkBullet2: { type: String, default: "" },
    networkBullet3: { type: String, default: "" },
    networkBullet4: { type: String, default: "" },

    // Partner section
    partnerHeading: { type: String, default: "" },
    benefit1Title: { type: String, default: "" },
    benefit1Desc: { type: String, default: "" },
    benefit2Title: { type: String, default: "" },
    benefit2Desc: { type: String, default: "" },
    benefit3Title: { type: String, default: "" },
    benefit3Desc: { type: String, default: "" },

    // Process section
    processHeading: { type: String, default: "" },
    process1Title: { type: String, default: "" },
    process1Desc: { type: String, default: "" },
    process2Title: { type: String, default: "" },
    process2Desc: { type: String, default: "" },
    process3Title: { type: String, default: "" },
    process3Desc: { type: String, default: "" },

    // End-to-end section
    endToEndHeading: { type: String, default: "" },
    endToEndP1: { type: String, default: "" },
    endToEndP2: { type: String, default: "" },
    lifecycle1: { type: String, default: "" },
    lifecycle2: { type: String, default: "" },
    lifecycle3: { type: String, default: "" },
    lifecycle4: { type: String, default: "" },

    // CTA
    ctaHeading: { type: String, default: "" },
    ctaSubtext: { type: String, default: "" },
  },
  { timestamps: true }
);

// In development, delete the cached model so schema changes take effect without a full server restart.
if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).DeveloperContent;
}

export default models.DeveloperContent || model("DeveloperContent", DeveloperContentSchema);
