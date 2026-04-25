import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { quizId } = await req.json()

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Create the session
    const quizSession = await prisma.quizSession.create({
      data: {
        userId: session.user.id,
        quizId: quizId,
        mode: quiz.mode,
        totalQuestions: quiz._count.questions,
        status: "IN_PROGRESS",
      }
    })

    return NextResponse.json(quizSession)
  } catch (error) {
    console.error("CREATE SESSION ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
