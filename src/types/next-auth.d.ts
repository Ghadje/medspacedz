import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      specialtyId?: string | null;
      facultyId?: string | null;
      studyYearId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    specialtyId?: string | null;
    facultyId?: string | null;
    studyYearId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    specialtyId?: string | null;
    facultyId?: string | null;
    studyYearId?: string | null;
  }
}
