// One-time admin password reset script.
// Run: node scripts/reset-admin-now.js
// DELETE this file after use.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const EMAIL = "nedgerrard@gmail.com";
const NEW_PASSWORD = "C21MetroProjects1!";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "client"], default: "client" },
  emailVerified: { type: Boolean, default: false },
  accountStatus: { type: String, default: "active" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "ppm" });
  console.log("Connected.");

  const hash = await bcrypt.hash(NEW_PASSWORD, 10);

  // Try to update existing admin
  const existing = await User.findOne({ email: EMAIL.toLowerCase(), role: "admin" });
  if (existing) {
    await User.findByIdAndUpdate(existing._id, { passwordHash: hash });
    console.log(`✅ Password updated for existing admin: ${EMAIL}`);
  } else {
    // Check if any admin exists
    const anyAdmin = await User.findOne({ role: "admin" });
    if (anyAdmin) {
      console.log(`❌ No admin found with email ${EMAIL}.`);
      console.log(`   Existing admin email: ${anyAdmin.email}`);
      console.log(`   Re-run with correct email, or update EMAIL in this script.`);
    } else {
      // No admin at all — create one
      await User.create({
        name: "PPM Admin",
        email: EMAIL.toLowerCase(),
        passwordHash: hash,
        role: "admin",
        emailVerified: true,
        accountStatus: "active",
      });
      console.log(`✅ New admin created: ${EMAIL}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done. You can now log in at /admin/dashboard");
  console.log(`Email: ${EMAIL}`);
  console.log(`Password: ${NEW_PASSWORD}`);
}

run().catch(err => { console.error(err); process.exit(1); });
