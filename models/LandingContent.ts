import { Schema, model, models } from "mongoose";

const LandingContentSchema = new Schema(
  {
    // Hero
    heroTagline: { type: String, default: "" },
    heroLine1: { type: String, default: "" },
    heroAccent: { type: String, default: "" },
    heroLine3: { type: String, default: "" },
    heroSubtext: { type: String, default: "" },

    // Stats
    stat1Value: { type: String, default: "" },
    stat1Unit: { type: String, default: "" },
    stat1Label: { type: String, default: "" },
    stat2Value: { type: String, default: "" },
    stat2Unit: { type: String, default: "" },
    stat2Label: { type: String, default: "" },
    stat3Value: { type: String, default: "" },
    stat3Unit: { type: String, default: "" },
    stat3Label: { type: String, default: "" },

    // Ethos
    ethosHeading: { type: String, default: "" },
    ethosBody: { type: String, default: "" },

    // CTA
    ctaHeading: { type: String, default: "" },

    // Services grid
    svc1Label: { type: String, default: "" },
    svc1Sub:   { type: String, default: "" },
    svc1Desc:  { type: String, default: "" },
    svc2Label: { type: String, default: "" },
    svc2Sub:   { type: String, default: "" },
    svc2Desc:  { type: String, default: "" },
    svc3Label: { type: String, default: "" },
    svc3Sub:   { type: String, default: "" },
    svc3Desc:  { type: String, default: "" },
    svc4Label: { type: String, default: "" },
    svc4Sub:   { type: String, default: "" },
    svc4Desc:  { type: String, default: "" },
    svc5Label: { type: String, default: "" },
    svc5Sub:   { type: String, default: "" },
    svc5Desc:  { type: String, default: "" },
    svc6Label: { type: String, default: "" },
    svc6Sub:   { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.LandingContent || model("LandingContent", LandingContentSchema);
