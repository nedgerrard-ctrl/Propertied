import { Schema, model, models } from "mongoose";

const BlogPageContentSchema = new Schema(
  {
    heroHeadingMain:   { type: String, default: "" },
    heroHeadingAccent: { type: String, default: "" },
    heroSubtext:       { type: String, default: "" },
  },
  { timestamps: true }
);

const BlogPageContent =
  models.BlogPageContent || model("BlogPageContent", BlogPageContentSchema);

export default BlogPageContent;
