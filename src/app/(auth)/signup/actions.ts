"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  specialtyId: z.string().optional(),
  facultyId: z.string().optional(),
  studyYearId: z.string().optional(),
})

export async function signup(formData: z.infer<typeof signupSchema>) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    })

    if (existingUser) {
      return { error: "Cet email est déjà utilisé" }
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10)

    const user = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        passwordHash: hashedPassword,
        phone: formData.phone,
        role: "STUDENT",
        // Only link if IDs are provided and look like IDs
        specialtyId: formData.specialtyId?.length && formData.specialtyId.length > 10 ? formData.specialtyId : null,
        facultyId: formData.facultyId?.length && formData.facultyId.length > 10 ? formData.facultyId : null,
        studyYearId: formData.studyYearId?.length && formData.studyYearId.length > 10 ? formData.studyYearId : null,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Signup error details:", error)
    // Return more specific error for now to help debug
    return { error: error.message || "Une erreur est survenue lors de l'inscription" }
  }
}
