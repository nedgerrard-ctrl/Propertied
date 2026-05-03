import { Schema, model, models } from "mongoose";

const TestimonialContentSchema = new Schema(
  {
    // Cinematic quotes
    cine1Quote: { type: String, default: "" },
    cine1Client: { type: String, default: "" },
    cine2Quote: { type: String, default: "" },
    cine2Client: { type: String, default: "" },
    cine3Quote: { type: String, default: "" },
    cine3Client: { type: String, default: "" },

    // Grid cards
    grid1Quote: { type: String, default: "" },
    grid1Client: { type: String, default: "" },
    grid1Rating: { type: Number, default: 0 },
    grid2Quote: { type: String, default: "" },
    grid2Client: { type: String, default: "" },
    grid2Rating: { type: Number, default: 0 },
    grid3Quote: { type: String, default: "" },
    grid3Client: { type: String, default: "" },
    grid3Rating: { type: Number, default: 0 },
    grid4Quote: { type: String, default: "" },
    grid4Client: { type: String, default: "" },
    grid4Rating: { type: Number, default: 0 },
    grid5Quote: { type: String, default: "" },
    grid5Client: { type: String, default: "" },
    grid5Rating: { type: Number, default: 0 },

    // CTA
    ctaHeading: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.TestimonialContent || model("TestimonialContent", TestimonialContentSchema);
