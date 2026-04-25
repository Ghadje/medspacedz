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
        // These would normally be linked by ID from dropdowns
        specialtyId: formData.specialtyId,
        // facultyId and studyYearId should be handled carefully if they are optional or text
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "Une erreur est survenue lors de l'inscription" }
  }
}
