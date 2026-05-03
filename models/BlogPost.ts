// models/BlogPost.ts
import { Schema, model, models } from "mongoose";

const BlogSectionSchema = new Schema(
  {
    heading: { type: String, default: "" },
    body: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    publishDate: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      default: "Insights",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    content: {
      type: [BlogSectionSchema],
      default: [],
      validate: {
        validator(value: { body?: string }[]) {
          return value.length > 0 && value.some((section) => section.body?.trim());
        },
        message: "Blog body is required.",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.BlogPost || model("BlogPost", BlogPostSchema);