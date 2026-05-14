import { Schema, model, models } from "mongoose";

const ShowcaseProjectSchema = new Schema(
  {
    name:      { type: String, required: true },
    address:   { type: String, required: true },
    image:     { type: String, default: "" },
    order:     { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.ShowcaseProject || model("ShowcaseProject", ShowcaseProjectSchema);
