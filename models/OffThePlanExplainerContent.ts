import { Schema, model, models } from "mongoose";

const OffThePlanExplainerContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },

    // Intro
    introPara1: { type: String, default: "" },
    introPara2: { type: String, default: "" },
    introPara3: { type: String, default: "" },

    // Advantages heading
    advantagesHeading: { type: String, default: "" },

    // Advantage 1
    adv1Heading: { type: String, default: "" },
    adv1Body:    { type: String, default: "" },

    // Advantage 2
    adv2Heading: { type: String, default: "" },
    adv2Body:    { type: String, default: "" },

    // Advantage 3
    adv3Heading: { type: String, default: "" },
    adv3Body:    { type: String, default: "" },

    // Advantage 4
    adv4Heading: { type: String, default: "" },
    adv4Body:    { type: String, default: "" },

    // Advantage 5
    adv5Heading: { type: String, default: "" },
    adv5Body:    { type: String, default: "" },

    // Advantage 6 — Tax
    adv6Heading:         { type: String, default: "" },
    adv6Body:            { type: String, default: "" },
    adv6Bullet1:         { type: String, default: "" },
    adv6Bullet2:         { type: String, default: "" },
    adv6QualifyingAssets: { type: String, default: "" },

    // Practical Effect
    practicalEffectHeading: { type: String, default: "" },
    practicalEffect1:       { type: String, default: "" },
    practicalEffect2:       { type: String, default: "" },
    practicalEffect3:       { type: String, default: "" },
    practicalEffect4:       { type: String, default: "" },
    practicalEffect5:       { type: String, default: "" },
    ownerOccupiersNote:     { type: String, default: "" },

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
  delete (models as Record<string, unknown>).OffThePlanExplainerContent;
}

export default models.OffThePlanExplainerContent ||
  model("OffThePlanExplainerContent", OffThePlanExplainerContentSchema);
