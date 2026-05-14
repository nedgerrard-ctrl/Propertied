/**
 * Backfills placeholder images on seeded showcase projects that have no image.
 * Run once: npx tsx scripts/update-showcase-images.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

const ShowcaseProjectSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    address:   { type: String, required: true },
    image:     { type: String, default: "" },
    order:     { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShowcaseProject =
  mongoose.models.ShowcaseProject ||
  mongoose.model("ShowcaseProject", ShowcaseProjectSchema);

const PLACEHOLDER_IMAGES: Record<string, string> = {
  "elk":           "/images/house1.png",
  "yarra one":     "/images/house2.png",
  "hawthorn park": "/images/house3.png",
  "noir":          "/images/house4.png",
  "barkly estate": "/images/For buyers.jpg",
};

async function run() {
  await mongoose.connect(MONGODB_URI as string, { dbName: "ppm" });
  const projects = await ShowcaseProject.find({ image: "" });

  for (const p of projects) {
    const key = (p.name as string).toLowerCase();
    const img = PLACEHOLDER_IMAGES[key];
    if (img) {
      await ShowcaseProject.findByIdAndUpdate(p._id, { image: img });
      console.log(`Updated "${p.name}" → ${img}`);
    }
  }

  console.log("Done.");
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
