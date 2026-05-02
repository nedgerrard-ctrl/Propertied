import { Schema, model, models } from "mongoose";

const AboutContentSchema = new Schema(
  {
    // Hero
    heroHeadingMain: { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },

    // Brand Story
    pullQuote: { type: String, default: "" },
    storyP1: { type: String, default: "" },
    storyP2: { type: String, default: "" },
    storyP3: { type: String, default: "" },
    storyP4: { type: String, default: "" },

    // Stats
    stat1Value: { type: String, default: "" },
    stat1Label: { type: String, default: "" },
    stat2Value: { type: String, default: "" },
    stat2Label: { type: String, default: "" },
    stat3Value: { type: String, default: "" },
    stat3Label: { type: String, default: "" },

    // Cycle steps
    step1Title: { type: String, default: "" },
    step1Desc: { type: String, default: "" },
    step2Title: { type: String, default: "" },
    step2Desc: { type: String, default: "" },
    step3Title: { type: String, default: "" },
    step3Desc: { type: String, default: "" },
    step4Title: { type: String, default: "" },
    step4Desc: { type: String, default: "" },
    step5Title: { type: String, default: "" },
    step5Desc: { type: String, default: "" },
    step6Title: { type: String, default: "" },
    step6Desc: { type: String, default: "" },

    // Team
    member1Name: { type: String, default: "" },
    member1Role: { type: String, default: "" },
    member1Image: { type: String, default: "" },
    member1Bio: { type: String, default: "" },
    member2Name: { type: String, default: "" },
    member2Role: { type: String, default: "" },
    member2Image: { type: String, default: "" },
    member2Bio: { type: String, default: "" },

    // Developer services
    devHeading: { type: String, default: "" },
    devP1: { type: String, default: "" },
    devP2: { type: String, default: "" },
    service1: { type: String, default: "" },
    service2: { type: String, default: "" },
    service3: { type: String, default: "" },
    service4: { type: String, default: "" },

    // Overseas reach section
    overseasHeadingMain: { type: String, default: "" },
    overseasHeadingAccent: { type: String, default: "" },
    overseasP1: { type: String, default: "" },
    overseasP2: { type: String, default: "" },
    overseasStat1Value: { type: String, default: "" },
    overseasStat1Label: { type: String, default: "" },
    overseasStat2Value: { type: String, default: "" },
    overseasStat2Label: { type: String, default: "" },
    overseasStat3Value: { type: String, default: "" },
    overseasStat3Label: { type: String, default: "" },

    // Track record
    trackHeading: { type: String, default: "" },
    project1Location: { type: String, default: "" },
    project1Type: { type: String, default: "" },
    project1Status: { type: String, default: "" },
    project2Location: { type: String, default: "" },
    project2Type: { type: String, default: "" },
    project2Status: { type: String, default: "" },
    project3Location: { type: String, default: "" },
    project3Type: { type: String, default: "" },
    project3Status: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.AboutContent || model("AboutContent", AboutContentSchema);
