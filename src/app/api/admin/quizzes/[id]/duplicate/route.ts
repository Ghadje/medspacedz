import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  context: any
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const originalQuiz = await prisma.quiz.findUnique({
      where: { id: (await context.params).id },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    if (!originalQuiz) {
      return NextResponse.json({ error: "Quiz non trouvé" }, { status: 404 })
    }

    // Create the duplicate quiz
    const duplicateQuiz = await prisma.quiz.create({
      data: {
        title: `${originalQuiz.title} (copie)`,
        description: originalQuiz.description,
        specialtyId: originalQuiz.specialtyId,
        studyYearId: originalQuiz.studyYearId,
        moduleId: originalQuiz.moduleId,
        courseSupportId: originalQuiz.courseSupportId,
        mode: originalQuiz.mode,
        durationMinutes: originalQuiz.durationMinutes,
        order: originalQuiz.order,
        isPublished: false, // Force draft for duplicates
        questions: {
          create: originalQuiz.questions.map(q => ({
            statement: q.statement,
            explanation: q.explanation,
            difficulty: q.difficulty,
            yearReference: q.yearReference,
            type: q.type,
            order: q.order,
            answers: {
              create: q.answers.map(a => ({
                text: a.text,
                isCorrect: a.isCorrect,
                order: a.order
              }))
            }
          }))
        }
      }
    })

    return NextResponse.json(duplicateQuiz, { status: 201 })
  } catch (error) {
    console.error("Error duplicating quiz:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
