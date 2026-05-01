import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: string;
      userType?: string;
      pendingApproval?: boolean;
      phone?: string;
    };
  }

  interface User {
    role?: string;
    userType?: string;
    pendingApproval?: boolean;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    userType?: string;
    pendingApproval?: boolean;
    phone?: string;
  }
}
