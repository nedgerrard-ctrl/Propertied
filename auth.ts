import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isValidPassword } from "@/lib/password-validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
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

        if (user.isDeleted) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User",
          role: user.role,
          userType: user.userType,
          accountStatus: user.accountStatus ?? "active",
          pendingApproval: user.pendingApproval ?? false,
          phone: user.phone ?? "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { role?: string; userType?: string; accountStatus?: string; pendingApproval?: boolean; phone?: string };
        token.role = u.role;
        token.userType = u.userType;
        token.accountStatus = u.accountStatus;
        token.pendingApproval = u.pendingApproval;
        token.phone = u.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.userType = token.userType as string | undefined;
        session.user.accountStatus = token.accountStatus as string | undefined;
        session.user.pendingApproval = token.pendingApproval as boolean | undefined;
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
  },
});