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

    // Who We Are
    whoWeAreHeading: { type: String, default: "" },
    whoWeAreBody:    { type: String, default: "" },

    // Ethos
    ethosHeading: { type: String, default: "" },
    ethosBody: { type: String, default: "" },

    // What We Do
    whatWeDoBody2: { type: String, default: "" },
    whatWeDoBody3: { type: String, default: "" },

    // Our Transition
    transitionHeading: { type: String, default: "" },
    transitionP1: { type: String, default: "" },
    transitionP2: { type: String, default: "" },
    transitionP3: { type: String, default: "" },
    transitionP4: { type: String, default: "" },

    // Federal Budget
    budgetHeading:    { type: String, default: "" },
    budgetBullet1:    { type: String, default: "" },
    budgetBullet2:    { type: String, default: "" },
    budgetBody:       { type: String, default: "" },
    budgetDisclaimer: { type: String, default: "" },

    // Why Choose PPM
    whyHeading:     { type: String, default: "" },
    why1:           { type: String, default: "" },
    why2:           { type: String, default: "" },
    why3:           { type: String, default: "" },
    why4:           { type: String, default: "" },
    why5:           { type: String, default: "" },
    why6:           { type: String, default: "" },
    whyStewardBody: { type: String, default: "" },

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

// Delete the cached model in development so schema changes take effect without a full restart
if (process.env.NODE_ENV !== "production") {
  delete (models as Record<string, unknown>)["LandingContent"];
}

export default models.LandingContent || model("LandingContent", LandingContentSchema);
