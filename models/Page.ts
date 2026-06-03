import { Schema, model, models } from "mongoose";

const PageSchema = new Schema(
  {
    // Core
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 100,
    },

    subtitle: { type: String, default: "" },

    // SEO
    seoTitle: { type: String, default: "", maxlength: 60 },
    seoDescription: { type: String, default: "", maxlength: 160 },

    // Hero section
    heroEyebrow: { type: String, default: "", maxlength: 50 },
    heroTitle: { type: String, default: "", maxlength: 100 },
    heroSummary: { type: String, default: "", maxlength: 300 },

    // Main body (double-newline separated paragraphs)
    body: { type: String, default: "", maxlength: 1000 },

    // CTA section
    ctaTitle: { type: String, default: "", maxlength: 100 },
    ctaText: { type: String, default: "", maxlength: 300 },
    ctaLink: { type: String, default: "", maxlength: 200 },

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
    navLabel: { type: String, default: "", maxlength: 50 },
    pageGroup: { type: String, default: "more", maxlength: 50 },
    statusLabel: { type: String, default: "", maxlength: 50 },
    featuredImage: { type: String, default: "" },
    sortOrder: { type: Number, default: 100 },

    // Template
    templateKey: {
      type: String,
      enum: ["text-only", "text-image"],
      default: "text-only",
    },

    // Sections (used by text-image template)
    sections: [
      {
        heading: { type: String, default: "", maxlength: 100 },
        body: { type: String, default: "", maxlength: 1000 },
        image: { type: String, default: "" },
      },
    ],

    // Status
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // Archive
    archived: { type: Boolean, default: false },

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