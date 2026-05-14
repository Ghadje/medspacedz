import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params;
    const { isPublished } = await req.json()

    if (typeof isPublished !== "boolean") {
      return NextResponse.json({ error: "Valeur invalide pour isPublished" }, { status: 400 })
    }

    const quiz = await prisma.quiz.update({
      where: { id },
      data: { isPublished },
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Error toggling publish status:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
