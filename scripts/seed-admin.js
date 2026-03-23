//adding first admin
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      required: true,
      default: "client",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "ppm",
  });

  const email = "admin@ppm.com.au";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await User.create({
    name: "PPM Admin",
    email,
    passwordHash,
    role: "admin",
  });

  console.log("Admin user created.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});