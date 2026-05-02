import { Schema, model, models } from "mongoose";

const PageSchema = new Schema(
  {
    // Core
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    subtitle: { type: String, default: "" },

    // SEO
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },

    // Hero section
    heroEyebrow: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroSummary: { type: String, default: "" },

    // Main body (double-newline separated paragraphs)
    body: { type: String, default: "" },

    // CTA section
    ctaTitle: { type: String, default: "" },
    ctaText: { type: String, default: "" },
    ctaLink: { type: String, default: "" },

    // Paragraph blocks (legacy)
    paragraph1Title: { type: String, default: "" },
    paragraph1: { type: String, default: "" },

    paragraph2Title: { type: String, default: "" },
    paragraph2: { type: String, default: "" },

    paragraph3Title: { type: String, default: "" },
    paragraph3: { type: String, default: "" },

    paragraph4Title: { type: String, default: "" },
    paragraph4: { type: String, default: "" },

    // Optional controls
    showInNavbar: { type: Boolean, default: false },
    navLabel: { type: String, default: "" },
    pageGroup: { type: String, default: "more" },
    statusLabel: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    sortOrder: { type: Number, default: 100 },

    // Status
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // Webflow sync
    webflowItemId: { type: String, default: "" },
    syncStatus: {
      type: String,
      enum: ["never_synced", "staged_synced", "published_synced", "failed"],
      default: "never_synced",
    },
    syncError: { type: String, default: "" },
    lastSyncedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Page || model("Page", PageSchema);