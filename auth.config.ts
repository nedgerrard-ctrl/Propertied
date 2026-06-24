import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no bcrypt, no mongoose, no Node.js-only modules.
// Used by middleware (edge runtime) and merged into auth.ts (Node.js runtime).
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  // Credentials provider omitted — it needs bcrypt which cannot run on edge.
  // auth.ts adds it at the Node.js layer.
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          role?: string;
          userType?: string;
          accountStatus?: string;
          pendingApproval?: boolean;
          phone?: string;
        };
        token.role          = u.role;
        token.userType      = u.userType;
        token.accountStatus = u.accountStatus;
        token.pendingApproval = u.pendingApproval;
        token.phone         = u.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role          = token.role          as string | undefined;
        session.user.userType      = token.userType      as string | undefined;
        session.user.accountStatus = token.accountStatus as string | undefined;
        session.user.pendingApproval = token.pendingApproval as boolean | undefined;
        session.user.phone         = token.phone         as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
