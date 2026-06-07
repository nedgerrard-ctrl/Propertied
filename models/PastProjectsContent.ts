import { Schema, model, models } from "mongoose";

const ProjectItemSchema = new Schema(
  {
    id:       { type: String, default: "" },
    name:     { type: String, default: "" },
    address:  { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    link:     { type: String, default: "" },
  },
  { _id: false }
);

const PastProjectsContentSchema = new Schema(
  {
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },
    closingText:       { type: String, default: "" },
    projects:          { type: [ProjectItemSchema], default: [] },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete (models as Record<string, unknown>).PastProjectsContent;
}

export default models.PastProjectsContent ||
  model("PastProjectsContent", PastProjectsContentSchema);
