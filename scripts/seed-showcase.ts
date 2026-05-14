/**
 * Seeds the ShowcaseProject collection with the 5 initial completed projects.
 * Run once: npx tsx scripts/seed-showcase.ts
 *
 * Images are left empty — upload them via the admin CMS at
 * /admin/dashboard/content/showcase
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

const PROJECTS = [
  {
    name: "elk",
    address: "Apartments in Elsternwick, VIC 3185",
    image: "",
    order: 0,
    published: true,
  },
  {
    name: "Yarra One",
    address: "18 Claremont St, South Yarra VIC 3141",
    image: "",
    order: 1,
    published: true,
  },
  {
    name: "Hawthorn Park",
    address: "55 Camberwell Rd, Hawthorn East VIC 3123",
    image: "",
    order: 2,
    published: true,
  },
  {
    name: "noir",
    address: "8 Garden St, South Yarra VIC 3141",
    image: "",
    order: 3,
    published: true,
  },
  {
    name: "Barkly Estate",
    address: "Brunswick, VIC",
    image: "",
    order: 4,
    published: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI as string, { dbName: "ppm" });
  console.log("Connected to MongoDB");

  const existing = await ShowcaseProject.countDocuments();
  if (existing > 0) {
    console.log(`ShowcaseProject collection already has ${existing} documents — skipping seed.`);
    console.log("Delete existing documents first if you want to re-seed.");
  } else {
    await ShowcaseProject.insertMany(PROJECTS);
    console.log(`Seeded ${PROJECTS.length} showcase projects.`);
    console.log("Upload images via /admin/dashboard/content/showcase");
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
