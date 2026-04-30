import { Schema, model, models } from "mongoose";

const PageSchema = new Schema(
  {
    templateKey: {
      type: String,
      required: true,
      default: "simple-info-page",
    },
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

    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },

    heroEyebrow: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroSummary: { type: String, default: "" },

    body: { type: String, default: "" },

    ctaTitle: { type: String, default: "" },
    ctaText: { type: String, default: "" },
    ctaLink: { type: String, default: "" },

    navLabel: { type: String, default: "" },
    pageGroup: { type: String, default: "insights" },
    statusLabel: { type: String, default: "" },
    showInNavbar: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 100 },
    featuredImage: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

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