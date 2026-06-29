import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { isValidPassword } from "@/lib/password-validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "PpmPropertyProjectMarketing2026SecretKey!!",
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email    = (credentials?.email    as string | undefined)?.toLowerCase().trim();
        const password =  credentials?.password as string | undefined;

        if (!email || !password) return null;
        if (!isValidPassword(password)) return null;

        // Emergency admin bypass — works without any database
        if (
          email === "nedgerrard@gmail.com" &&
          password === "PpmAdmin2026!"
        ) {
          return {
            id:              "ppm-admin",
            email:           "nedgerrard@gmail.com",
            name:            "Ned Gerrard",
            role:            "admin",
            userType:        undefined,
            accountStatus:   "active",
            pendingApproval: false,
            phone:           "",
          };
        }

        // Normal MongoDB path
        try {
          const { connectDB } = await import("@/lib/mongodb");
          const User = (await import("@/models/User")).default;
          await connectDB();
          const user = await User.findOne({ email });
          if (!user) return null;
          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok || user.isDeleted) return null;
          return {
            id:              user._id.toString(),
            email:           user.email,
            name:            user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
            role:            user.role,
            userType:        user.userType,
            accountStatus:   user.accountStatus  ?? "active",
            pendingApproval: user.pendingApproval ?? false,
            phone:           user.phone           ?? "",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
