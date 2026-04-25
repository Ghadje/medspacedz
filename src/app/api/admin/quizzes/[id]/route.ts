import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const quizSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  specialtyId: z.string().min(1, "Spécialité requise"),
  studyYearId: z.string().min(1, "Année d'étude requise"),
  moduleId: z.string().min(1, "Module requis"),
  courseSupportId: z.string().optional().nullable(),
  mode: z.enum(["TRAINING", "EXAM"]),
  durationMinutes: z.number().int().positive().optional().nullable(),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: (await context.params).id },
      include: {
        specialty: { select: { id: true, name: true } },
        studyYear: { select: { id: true, name: true } },
        module: { select: { id: true, title: true } },
        courseSupport: { select: { id: true, title: true } },
        _count: { select: { questions: true } }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz non trouvé" }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()

    // Ensure courseSupportId is either valid or undefined/null
    if (body.courseSupportId === "") {
      body.courseSupportId = null
    }

    if (typeof body.durationMinutes === 'string' && body.durationMinutes) {
      body.durationMinutes = parseInt(body.durationMinutes)
    }
    if (typeof body.order === 'string' && body.order) {
      body.order = parseInt(body.order)
    }

    const validatedData = quizSchema.parse(body)

    const quiz = await prisma.quiz.update({
      where: { id: (await context.params).id },
      data: validatedData,
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Error updating quiz:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: (error as any).issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Prisma handles cascading deletes if configured, or we must delete relations manually.
    // Assuming cascading delete for QuizSession, Question is handled or we do it here.
    
    // Manual cleanup of questions to be safe
    await prisma.question.deleteMany({
      where: { quizId: (await context.params).id }
    })

    await prisma.quiz.delete({
      where: { id: (await context.params).id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting quiz:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
