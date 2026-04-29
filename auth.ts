import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isValidPassword } from "@/lib/password-validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        if (!isValidPassword(password)) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: email.toLowerCase().trim(),
        });

        if (!user) {
          return null;
        }

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
          role: user.role,
          userType: user.userType,
          pendingApproval: user.pendingApproval ?? false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { role?: string; userType?: string; pendingApproval?: boolean };
        token.role = u.role;
        token.userType = u.userType;
        token.pendingApproval = u.pendingApproval;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.userType = token.userType as string | undefined;
        session.user.pendingApproval = token.pendingApproval as boolean | undefined;
      }
      return session;
    },
  },
});