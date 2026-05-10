const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
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
    passwordHash: { type: String, required: true },
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(email.trim())) return "Enter a valid email address.";
  return null;
}

function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include at least one special character.";
  return null;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function askPassword(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  // Suppress echoing of typed characters while still showing the question
  rl._writeToOutput = function (str) {
    if (str === question) rl.output.write(str);
  };
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      process.stdout.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

async function seed() {
  console.log("\n--- Create Admin Account ---\n");
  console.log("Password rules:");
  console.log("  - At least 8 characters");
  console.log("  - Include uppercase, lowercase, and a number");
  console.log("  - Include at least 1 special character\n");

  let email;
  while (true) {
    const input = await ask("Admin email: ");
    const error = validateEmail(input);
    if (error) {
      console.error(`  Error: ${error}`);
    } else {
      email = input.trim().toLowerCase();
      break;
    }
  }

  let password;
  while (true) {
    const input = await askPassword("Admin password: ");
    const error = validatePassword(input);
    if (error) {
      console.error(`  Error: ${error}`);
    } else {
      password = input;
      break;
    }
  }

  console.log("\nConnecting to database...");
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "ppm" });

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("An admin with that email already exists.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name: "PPM Admin", email, passwordHash, role: "admin" });

  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
