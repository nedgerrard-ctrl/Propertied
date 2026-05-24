import { Schema, model, models } from "mongoose";

const ResourceItemSchema = new Schema(
  {
    id:       { type: String, default: "" },
    label:    { type: String, default: "" },
    fileUrl:  { type: String, default: "" },
    fileName: { type: String, default: "" },
  },
  { _id: false }
);

const ResourceSectionSchema = new Schema(
  {
    id:      { type: String, default: "" },
    heading: { type: String, default: "" },
    items:   { type: [ResourceItemSchema], default: [] },
  },
  { _id: false }
);

const ResourcesContentSchema = new Schema(
  {
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },
    sections:          { type: [ResourceSectionSchema], default: [] },
    footerNote:        { type: String, default: "" },
    footerEmail:       { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).ResourcesContent;
}

export default models.ResourcesContent ||
  model("ResourcesContent", ResourcesContentSchema);
