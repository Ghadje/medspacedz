import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { isPublished } = await req.json()

    if (typeof isPublished !== "boolean") {
      return NextResponse.json({ error: "Valeur invalide pour isPublished" }, { status: 400 })
    }

    const quiz = await prisma.quiz.update({
      where: { id: (await context.params).id },
      data: { isPublished },
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Error toggling publish status:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
