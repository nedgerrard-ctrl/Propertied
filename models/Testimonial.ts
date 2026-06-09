import { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    quote:  { type: String, required: true },
    client: { type: String, required: true },
    image:  { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.Testimonial || model("Testimonial", TestimonialSchema);
