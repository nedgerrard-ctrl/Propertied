import { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    quote:  { type: String, required: true },
    client: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  },
  { timestamps: true }
);

export default models.Testimonial || model("Testimonial", TestimonialSchema);
