// Deployment trigger: 2026-05-15
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth-config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
});
