import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params;
    const originalQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        answers: true
      }
    })

    if (!originalQuestion) {
      return NextResponse.json({ error: "Question non trouvée" }, { status: 404 })
    }

    const duplicateQuestion = await prisma.question.create({
      data: {
        quizId: originalQuestion.quizId,
        courseId: originalQuestion.courseId,
        statement: `${originalQuestion.statement} (copie)`,
        explanation: originalQuestion.explanation,
        difficulty: originalQuestion.difficulty,
        yearReference: originalQuestion.yearReference,
        type: originalQuestion.type,
        order: originalQuestion.order + 1,
        answers: {
          create: originalQuestion.answers.map((a: any) => ({
            text: a.text,
            isCorrect: a.isCorrect,
            order: a.order
          }))
        }
      },
      include: { answers: true }
    })

    return NextResponse.json(duplicateQuestion, { status: 201 })
  } catch (error) {
    console.error("Error duplicating question:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
