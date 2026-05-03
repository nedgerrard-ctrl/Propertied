import { Schema, model, models } from "mongoose";

const CmsPageConfigSchema = new Schema(
  {
    slug:            { type: String, required: true, unique: true },
    name:            { type: String, required: true },
    description:     { type: String, default: "" },
    published:       { type: Boolean, default: true },
    contentUpdatedAt:{ type: Date, default: null },
  },
  { timestamps: true }
);

export default models.CmsPageConfig || model("CmsPageConfig", CmsPageConfigSchema);
